import { Authenticator } from 'restfulpy'
import {
  BaseException,
  AbstractBaseClassError,
  MethodMustOverrideError,
  AlreadyAuthenticatedError,
  AuthenticationRequiredError,
  BadCredentialsError,
  InvalidOperationError
} from '../src/exceptions'
import {
  FakeAuthenticatorMockupClient,
  NoAuthenticatorMockupClient,
  FakeMetadataMockupClient,
  MockupClient
} from './helpers'

describe('Abstract Authenticator Error', function () {
  it('instantiation', function (done) {
    expect(() => new Authenticator()).toThrow(
      new AbstractBaseClassError(Authenticator)
    )
    done()
  })
})

describe('Overriding login and logout', function () {
  let c = new FakeAuthenticatorMockupClient()
  it('Logout', function (done) {
    expect(() => c.logout()).toThrow(new MethodMustOverrideError())
    done()
  })

  it('Login', function (done) {
    expect(() => {
      window.localStorage.removeItem('token')
      return c.login({ email: 'user1@example.com', password: '123456' })
    }).toThrow(new MethodMustOverrideError())
    done()
  })
})

describe('Overriding metadata methods', function () {
  let c = new FakeMetadataMockupClient()
  it('Get Metadata', function (done) {
    expect(() => {
      return c.metadata
    }).toThrow(new MethodMustOverrideError())
    done()
  })

  it('Load Metadata', function (done) {
    expect(() => {
      return c.loadMetadata('something')
    }).toThrow(new MethodMustOverrideError())
    done()
  })

  it('Save Metadata', function (done) {
    expect(() => {
      return c.saveMetadata('something')
    }).toThrow(new MethodMustOverrideError())
    done()
  })
})

describe('Already authenticated', function () {
  let c = new MockupClient()
  beforeEach(function () {
    c.logout()
  })

  it('Double Login', function (done) {
    c.login({ email: 'user1@example.com', password: '123456' })
      .then(() => {
        expect(() => {
          return c.login({ email: 'user1@example.com', password: '123456' })
        }).toThrow(new AlreadyAuthenticatedError())
        done()
      })
      .catch(done.fail)
  })
})

describe('Bad Credentials', function () {
  let c = new MockupClient()
  beforeEach(function () {
    c.logout()
  })

  it('Invalid Credentials', function (done) {
    expect(() => {
      return c.login(null)
    }).toThrow(new BadCredentialsError())
    done()
  })
})

describe('Authentication required', function () {
  let c = new MockupClient()
  beforeEach(function () {
    c.logout()
  })

  it('Getting Role without login', function (done) {
    expect(() => {
      return c.authenticator.isInRole('admin')
    }).toThrow(new AuthenticationRequiredError())
    done()
  })

  it('Adding authentication headers without login', function (done) {
    expect(() => {
      return c.request('resources', 'load').addAuthenticationHeaders(true)
    }).toThrow(new AuthenticationRequiredError())

    expect(() => {
      return c.authenticator.addAuthenticationHeaders()
    }).toThrow(new AuthenticationRequiredError())
    done()
  })
})

describe('Base error default message', function () {
  class MessageLessError extends BaseException {
    constructor (...args) {
      super(...args, null)
    }
  }
  let messageLessError = new MessageLessError()
  it('Default error message', function (done) {
    expect(messageLessError.message).toEqual('Unhandled Error.')
    done()
  })
})

describe('No Authenticator Object', function () {
  let c = new NoAuthenticatorMockupClient()

  it('Login with no authenticator object', function (done) {
    expect(() => {
      return c.login()
    }).toThrow(new InvalidOperationError())
    done()
  })
})

describe('Encoding Test', function () {
  let c = new MockupClient()

  it('Invalid encoding', function (done) {
    let request = c.request('echo').setEncoding('InvalidEncoding')
    request
      .send()
      .then(done.fail)
      .catch(err => {
        expect(err.message).toBe(
          `encoding: ${request.encoding} is not supported.`
        )

        expect(err instanceof BaseException).toBeTruthy()
        done()
      })
  })
})
