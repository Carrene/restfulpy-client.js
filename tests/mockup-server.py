
from os.path import abspath, dirname

from nanohttp import text, json, quickstart
from restfulpy.authorization import authorize
from restfulpy.application import Application
from restfulpy.authentication import StatefulAuthenticator
from restfulpy.controllers import RootController


__version__ = '0.1.0'


class MockupAuthenticator(StatefulAuthenticator):
    pass


class MockupApplication(Application):
    __authenticator__ = MockupAuthenticator()
    builtin_configuration = '''
    '''

    def __init__(self):
        super().__init__(
            'lemur',
            root=Root(),
            root_path=abspath(dirname(__file__)),
            version=__version__,
        )

    def insert_basedata(self):
        pass

    def insert_mockup(self):
        pass


class Root(RootController):

    @text
    def index(self):
        return 'Index'

    @text
    @authorize
    def protected(self):
        return 'Protected'

    @json
    def version(self):
        return {
            'version': __version__
        }


if __name__ == '__main__':
    app = MockupApplication()
    app.configure()
    quickstart(application=app)
