
from os.path import abspath, dirname

from nanohttp import html, json, quickstart
from restfulpy.authorization import authorize
from restfulpy.application import Application
from restfulpy.authentication import StatefulAuthenticator
from restfulpy.controllers import RootController


__version__ = '0.1.0'


class MockupAuthenticator(StatefulAuthenticator):
    pass


class Root(RootController):

    @html
    @authorize
    def index(self):
        return 'Index'

    @json
    def version(self):
        return {
            'version': __version__
        }


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


if __name__ == '__main__':
    quickstart(application=MockupApplication())
