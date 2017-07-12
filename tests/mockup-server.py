#! /usr/bin/env python3

import os
import sys
import time
import threading
from os.path import abspath, dirname, join, exists
from subprocess import run
from wsgiref.simple_server import make_server

from sqlalchemy import Integer, Unicode
from nanohttp import text, json, context
from restfulpy.authorization import authorize
from restfulpy.application import Application
from restfulpy.authentication import StatefulAuthenticator
from restfulpy.controllers import RootController, ModelRestController
from restfulpy.orm import DeclarativeBase, OrderingMixin, PaginationMixin, FilteringMixin, Field, setup_schema, \
    DBSession


__version__ = '0.1.0'


HERE = abspath(dirname(__file__))
KARMA_EXECUTABLE = '%s start karma.config.js' % join(HERE, '../node_modules/karma/bin/karma')
SQLITE_DB = join(HERE, 'data', 'mockup.sqlite')
if exists(SQLITE_DB):
    os.remove(SQLITE_DB)


class Resource(OrderingMixin, PaginationMixin, FilteringMixin, DeclarativeBase):
    __tablename__ = 'resource'

    id = Field(Integer, primary_key=True)
    title = Field(Unicode, )


class MockupAuthenticator(StatefulAuthenticator):
    pass


class MockupApplication(Application):
    __authenticator__ = MockupAuthenticator()
    builtin_configuration = '''
    debug: true
    db:
      uri: sqlite:///%s      
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


class ResourceController(ModelRestController):

    @json
    @Resource.expose
    def get(self):
        return Resource.query


class Root(RootController):
    resources = ResourceController()

    @text
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
        run('%s --server-url=%s' % (KARMA_EXECUTABLE, server_url), shell=True)
        return 0
    except KeyboardInterrupt:
        print('CTRL+X is pressed.')
        return 1
    finally:
        httpd.shutdown()
        server_thread.join()


if __name__ == '__main__':
    sys.exit(main())
