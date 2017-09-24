#! /usr/bin/env python3

import os
import sys
import time
import threading
from os.path import abspath, dirname, join, exists
from subprocess import run
from wsgiref.simple_server import make_server

from sqlalchemy import Integer, Unicode
from nanohttp import text, json, context, RestController, HttpBadRequest, etag, HttpNotFound
from restfulpy.authorization import authorize
from restfulpy.application import Application
from restfulpy.authentication import StatefulAuthenticator
from restfulpy.controllers import RootController, ModelRestController, JsonPatchControllerMixin
from restfulpy.orm import DeclarativeBase, OrderingMixin, PaginationMixin, FilteringMixin, Field, setup_schema, \
    DBSession, ModifiedMixin, commit
from restfulpy.principal import JwtPrincipal, JwtRefreshToken


__version__ = '0.1.0'


HERE = abspath(dirname(__file__))
KARMA_EXECUTABLE = '%s start karma.config.js' % join(HERE, 'node_modules/karma/bin/karma')
DATA_DIR = join(HERE, 'tests', 'data')
SQLITE_DB = join(DATA_DIR, 'mockup.sqlite')

if exists(SQLITE_DB):
    os.remove(SQLITE_DB)

if not exists(DATA_DIR):
    os.mkdir(DATA_DIR)


class MockupMember:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


class Resource(ModifiedMixin, OrderingMixin, PaginationMixin, FilteringMixin, DeclarativeBase):
    __tablename__ = 'resource'

    id = Field(Integer, primary_key=True)
    title = Field(Unicode(30),
                  watermark='title here', icon='default', label='Title', pattern='[a-zA-Z0-9]{3,}', min_length=3)

    @property
    def __etag__(self):
        return self.last_modification_time.isoformat()


class MockupAuthenticator(StatefulAuthenticator):
    def validate_credentials(self, credentials):
        email, password = credentials
        if email == 'user1@example.com' and password == '123456':
            return MockupMember(id=1, email=email, roles=['user'])

    def create_refresh_principal(self, member_id=None):
        return JwtRefreshToken(dict(id=member_id))

    def create_principal(self, member_id=None, session_id=None):
        return JwtPrincipal(dict(id=1, email='user1@example.com', roles=['user'], sessionId='1'))


class MockupApplication(Application):
    __authenticator__ = MockupAuthenticator()
    builtin_configuration = '''
    debug: true
    db:
      uri: sqlite:///%s
    jwt:
      max_age: 20
      refresh_token:
        max_age: 60
        secure: false
    ''' % SQLITE_DB

    def __init__(self):
        super().__init__(
            'restfulpy-client-js-mockup-server',
            root=Root(),
            root_path=abspath(dirname(__file__)),
            version=__version__,
        )

    def insert_basedata(self):
        pass

    def insert_mockup(self):
        for i in range(1, 11):
            # noinspection PyArgumentList
            DBSession.add(Resource(id=i, title='resource%s' % i))
        DBSession.commit()

    def begin_request(self):
        context.response_headers.add_header('Access-Control-Allow-Origin', context.environ['HTTP_ORIGIN'])


class AuthController(RestController):

    @json
    def post(self):
        email = context.form.get('email')
        password = context.form.get('password')

        def bad():
            raise HttpBadRequest('Invalid email or password')

        if not (email and password):
            bad()

        principal = context.application.__authenticator__.login((email, password))
        if principal is None:
            bad()

        return dict(token=principal.dump())

    @json
    def delete(self):
        return {}


class ResourceController(JsonPatchControllerMixin, ModelRestController):
    __model__ = Resource

    @json
    @etag
    @Resource.expose
    def get(self, id_: int=None):
        q = Resource.query
        if id_ is not None:
            return q.filter(Resource.id == id_).one_or_none()
        return q

    @json
    @etag
    @Resource.expose
    @commit
    def put(self, id_: int=None):
        m = Resource.query.filter(Resource.id == id_).one_or_none()
        if m is None:
            raise HttpNotFound()
        m.update_from_request()
        context.etag_match(m.__etag__)
        return m

    @json
    @etag
    @commit
    def post(self):
        m = Resource()
        m.update_from_request()
        DBSession.add(m)
        return m

    @json
    @etag
    @commit
    def delete(self, id_: int=None):
        m = Resource.query.filter(Resource.id == id_).one_or_none()
        context.etag_match(m.__etag__)
        DBSession.delete(m)
        return m


class Root(RootController):
    resources = ResourceController()
    sessions = AuthController()

    @text('get')
    def index(self):
        return 'Index'

    @json
    def echo(self):
        return {k: v for i in (context.form, context.query_string) for k, v in i.items()}

    @text
    @authorize
    def protected(self):
        return 'Protected'

    @json
    def version(self):
        return {
            'version': __version__
        }


def main():
    app = MockupApplication()
    app.configure()
    app.initialize_models()
    setup_schema()
    # DBSession.commit()
    app.insert_mockup()
    httpd = make_server('localhost', 0, app)

    server_url = 'http://%s:%d' % httpd.server_address
    print('Serving %s' % server_url)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    try:
        server_thread.start()
        time.sleep(2)
        run('%s %s --server-url=%s' % (KARMA_EXECUTABLE, ' '.join(sys.argv[1:]), server_url), shell=True)
        return 0
    except KeyboardInterrupt:
        print('CTRL+X is pressed.')
        return 1
    finally:
        httpd.shutdown()
        server_thread.join()


if __name__ == '__main__':
    sys.exit(main())
