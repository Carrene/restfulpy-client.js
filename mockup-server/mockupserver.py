#! /usr/bin/env python3.6
import os
import sys
import time
import argparse
import threading
import tempfile
import functools
from os.path import dirname, abspath, join, exists
from subprocess import run
from wsgiref.simple_server import make_server

from mako.lookup import TemplateLookup
from sqlalchemy import Integer, Unicode
from nanohttp import text, json, context, RestController, HTTPBadRequest, \
    HTTPNotFound, settings, action, HTTPStatus
from restfulpy.authorization import authorize
from restfulpy.application import Application
from restfulpy.authentication import StatefulAuthenticator
from restfulpy.controllers import RootController, ModelRestController, JsonPatchControllerMixin
from restfulpy.orm import DeclarativeBase, OrderingMixin, PaginationMixin, FilteringMixin, Field, setup_schema, \
    DBSession, ModifiedMixin, commit
from restfulpy.principal import JwtPrincipal, JwtRefreshToken
from restfulpy.cli import Launcher


__version__ = '0.1.1'


here = abspath(dirname(__file__))
db = abspath(join(tempfile.gettempdir(), 'restfulpy-mockup-server.sqlite'))
_lookup = None


def get_lookup():
    global _lookup
    if _lookup is None:
        _lookup = TemplateLookup(directories=settings.templates.directories)
    return _lookup


def render_template(func, template_name):

    @functools.wraps(func)
    def wrapper(*args, **kwargs):

        result = func(*args, **kwargs)
        if hasattr(result, 'to_dict'):
            result = result.to_dict()
        elif not isinstance(result, dict):
            raise ValueError('The result must be an instance of dict, not: %s' % type(result))

        template_ = get_lookup().get_template(template_name)
        return template_.render(**result)

    return wrapper


template = functools.partial(action, content_type='text/html', inner_decorator=render_template)


class MockupMember:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


class Resource(ModifiedMixin, OrderingMixin, PaginationMixin, FilteringMixin, DeclarativeBase):
    __tablename__ = 'resource'

    id = Field(Integer, primary_key=True)
    title = Field(
        Unicode(30),
        watermark='title here',
        label='Title',
        pattern='[a-zA-Z0-9]{3,}',
        min_length=3
    )
    password = Field(
        Unicode(30),
        protected=True,
        nullable=False,
        default='123456'
    )


class MockupAuthenticator(StatefulAuthenticator):
    def validate_credentials(self, credentials):
        email, password = credentials
        if email == 'user1@example.com' and password == '123456':
            return MockupMember(id=1, email=email, roles=['user'])

    def create_refresh_principal(self, member_id=None):
        return JwtRefreshToken(dict(id=member_id))

    def create_principal(self, member_id=None, session_id=None):
        return JwtPrincipal(dict(id=1, email='user1@example.com', roles=['user'], sessionId='1'))


class AuthController(RestController):

    @json
    def post(self):
        email = context.form.get('email')
        password = context.form.get('password')

        def bad():
            raise HTTPBadRequest('Invalid email or password')

        if not (email and password):
            bad()

        principal = context.application.__authenticator__.login((email, password))
        if principal is None:
            bad()

        return dict(token=principal.dump())

    @json
    def delete(self):
        return {}

    @json
    @authorize
    def renew(self):
        context.application.__authenticator__.try_refresh_token(
            context.identity.session_id
        )
        return ''


class ResourceController(JsonPatchControllerMixin, ModelRestController):
    __model__ = Resource

    @json(prevent_form='666 Form does not allowed')
    @Resource.expose
    def get(self, id_: int=None):
        q = DBSession.query(Resource)
        status = context.query.get('status')

        if status:
            raise HTTPStatus(status)

        if id_ is not None:
            return q.filter(Resource.id == id_).one_or_none()
        return q

    @json
    @Resource.expose
    @commit
    def put(self, id_: int=None):
        m = DBSession.query(Resource).filter(Resource.id == id_).one_or_none()
        if m is None:
            raise HTTPNotFound()
        m.update_from_request()
        return m

    @json
    @commit
    def post(self):
        m = Resource()
        m.update_from_request()
        DBSession.add(m)
        return m

    @json
    @commit
    def delete(self, id_: int=None):
        m = DBSession.query(Resource).filter(Resource.id == id_).one_or_none()
        if m is None:
            raise HTTPNotFound()
        DBSession.delete(m)
        return m


class Root(RootController):
    resources = ResourceController()
    sessions = AuthController()

    @template('help.mako')
    def index(self):
        return dict(url=f'http://{context.environ["HTTP_HOST"]}')

    @json
    def echo(self):
        return {k: v for i in (context.form, context.query) for k, v in i.items()}

    @text
    @authorize
    def protected(self):
        return 'Protected'

    @json
    def version(self):
        return {
            'version': __version__
        }


class MockupApplication(Application):
    __authenticator__ = MockupAuthenticator()
    __configuration__ = f'''
    debug: true

    db:
      url: sqlite:///{db}

    jwt:
      max_age: 3600
      refresh_token:
        max_age: 92000
        secure: false

    templates:
      directories:
        - {here}/templates
    '''

    def __init__(self):
        super().__init__(
            'restfulpy-client-js-mockup-server',
            root=Root(),
            version=__version__,
        )

    def insert_basedata(self):
        pass

    def insert_mockup(self):
        for i in range(1, 11):
            # noinspection PyArgumentList
            DBSession.add(Resource(id=i, title='resource%s' % i, password='password%s' % i))
        DBSession.commit()

    def begin_request(self):
        if 'HTTP_ORIGIN' in context.environ:
            context.response_headers.add_header('Access-Control-Allow-Origin', context.environ['HTTP_ORIGIN'])
        super(MockupApplication, self).begin_request()


class SimpleMockupServerLauncher(Launcher):
    default_bind = '8080'
    application = None
    args = None

    def __init__(self):
        self.parser = parser = argparse.ArgumentParser(
            prog=sys.argv[0],
            description='Restfulpy js client mockup server'
        )
        parser.add_argument(
            '-c', '--config-file',
            metavar="FILE",
            help='List of configuration files separated by space. Default: ""'
        )
        parser.add_argument(
            '-b', '--bind',
            default=self.default_bind,
            metavar='{HOST:}PORT',
            help=f'Bind Address. default is {self.default_bind}, A free tcp port will be choosed automatically if the '
                 f'0 (zero) is given'
        )

        parser.add_argument(
            'command',
            nargs=argparse.REMAINDER,
            default=[],
            help='The command to run tests.'
        )

        parser.add_argument('-v', '--version', action='store_true', help='Show the mockup server\'s version.')

    def launch(self, args=None):
        self.args = self.parser.parse_args(args if args else None)
        if self.args.version:
            print(__version__)
            return

        self.application = MockupApplication()
        self.application.configure(files=self.args.config_file)
        if exists(db):
            os.remove(db)
        # makedirs(settings.data_directory, exist_ok=True)
        self.application.initialize_orm()
        setup_schema()
        # DBSession.commit()
        print(f'DB {DBSession.bind}')
        self.application.insert_mockup()
        host, port = self.args.bind.split(':') if ':' in self.args.bind else ('localhost', self.args.bind)
        httpd = make_server(host, int(port), self.application)

        url = 'http://%s:%d' % httpd.server_address
        print(f'The server is up!, Get {url} to more info about how to use it!')
        server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        try:
            server_thread.start()

            if not self.args.command:
                server_thread.join()
                exitstatus = 0
            else:
                test_runner_command = ' '.join(self.args.command).replace('{url}', url)
                time.sleep(1)
                result = run(test_runner_command, shell=True)
                exitstatus = result.returncode
            return exitstatus
        except KeyboardInterrupt:
            print('CTRL+X is pressed.')
            return 1
        finally:
            httpd.shutdown()
            sys.exit(exitstatus)
            # commented by pylover because of wrong exit code
            # server_thread.join()


if __name__ == '__main__':
    SimpleMockupServerLauncher()()

