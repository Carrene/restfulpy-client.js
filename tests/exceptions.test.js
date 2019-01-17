import { Authenticator } from 'restfulpy'
import {
  AbstractBaseClassError,
  MethodMustOverrideError
} from '../src/exceptions'
import { MockupClient, FakeMockupClient } from './helpers'

describe('Abstract Authenticator Error', function () {
  it('instantiation', function (done) {
    expect(() => new Authenticator()).toThrow(
      new AbstractBaseClassError(Authenticator)
    )
    done()
  })
})

describe('Abstract login and logout', function () {
  let fakeClient = new FakeMockupClient()
  let client = new MockupClient()
  client.logout()
  it('Login', function (done) {
    expect(() =>
      fakeClient.login({ email: 'user1@example.com', password: '123456' })
    ).toThrow(new MethodMustOverrideError())
    done()
  })

  it('Logout', function (done) {
    expect(() => fakeClient.logout()).toThrow(new MethodMustOverrideError())
    done()
  })
})
