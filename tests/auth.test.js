/**
 * Created by vahid on 7/13/17.
 */
import { MockupClient } from './helpers'

describe('Authentication', function () {
  let c = new MockupClient()

  beforeEach(function () {
    c.logout()
  })

  it('Login', function (done) {
    c.login({ email: 'user1@example.com', password: '123456' })
      .then(resp => {
        expect(resp.json.token).not.toBe(null)
        expect(c.authenticator.authenticated).toBeTruthy()
        expect(c.authenticator.isInRole('user')).toBeTruthy()
        expect(c.authenticator.isInRole('admin')).toBeFalsy()
        done()
      })
      .catch(done.fail)
  })

  it('Logout', function (done) {
    let callbackCheck = 0
    function logoutCallback () {
      callbackCheck = 1
    }
    c.logout(logoutCallback)

    expect(c.authenticator.authenticated).toBe(false)
    expect(callbackCheck).toEqual(1)
    done()
  })

  it('Restoring Token', function (done) {
    c.login({ email: 'user1@example.com', password: '123456' })
      .then(resp => {
        c.authenticator.member = null

        expect(c.authenticator.member).toBeTruthy()
        expect(c.authenticator.authenticated).toBeTruthy()
        done()
      })
      .catch(done.fail)
  })

  it('Empty token', function (done) {
    c.login({ email: 'user1@example.com', password: '123456' })
      .then(resp => {
        c.authenticator.token = null

        expect(c.authenticator.authenticated).toBeFalsy()
        expect(window.localStorage.getItem('token')).toBeFalsy()
        done()
      })
      .catch(done.fail)
  })

  it('Wrong token', function (done) {
    c.login({ email: 'user1@example.com', password: '123456' })
      .then(resp => {
        c.authenticator.token = 'wrong'

        expect(c.authenticator.authenticated).toBeFalsy()
        expect(window.localStorage.getItem('token')).toBeFalsy()
        done()
      })
      .catch(done.fail)
  })
})

describe('Refresh Token', function () {
  let c = new MockupClient()

  beforeEach(function () {
    c.logout()
  })

  it('Header: X-New-JWT-Token', function (done) {
    c.login({ email: 'user1@example.com', password: '123456' })
      .then(resp => {
        let previousToken = resp.json.token
        setTimeout(function () {
          c.request('sessions')
            .setVerb('RENEW')
            .send()
            .then(response => {
              let currentToken = response.getHeader(
                c.authenticator.tokenResponseHeaderKey
              )

              expect(currentToken).not.toBe(null)
              expect(currentToken).not.toEqual(previousToken)
              done()
            })
            .catch(done.fail)
        }, 1001)
      })
      .catch(done.fail)
  })
})
