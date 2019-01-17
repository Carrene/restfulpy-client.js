import { Authenticator } from 'restfulpy'
import {
  AbstractBaseClassError,
  MethodMustOverrideError
} from '../src/exceptions'
import { FakeMockupClient } from './helpers'

describe('Abstract Authenticator Error', function () {
  it('instantiation', function (done) {
    expect(() => new Authenticator()).toThrow(
      new AbstractBaseClassError(Authenticator)
    )
    done()
  })
})

describe('Abstract login and logout', function () {
  let c = new FakeMockupClient()

  it('Login', function (done) {
    expect(() =>
      c.login({ email: 'user1@example.com', password: '123456' })
    ).toThrow(new MethodMustOverrideError())
    done()
  })

  it('Logout', function (done) {
    expect(() => c.logout()).toThrow(new MethodMustOverrideError())
    done()
  })
})
