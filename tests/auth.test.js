/**
 * Created by vahid on 7/13/17.
 */
import { MockupClient } from './helpers'

describe('Authentication', function () {
  let c = new MockupClient()

  it('Login', function (done) {
    c.logout()
    c.login({ email: 'user1@example.com', password: '123456' })
      .then(resp => {
        expect(resp.json.token).not.toBe(null)
        expect(c.authenticator.authenticated).toBeTruthy()
        expect(c.authenticator.isInRole('user')).toBeTruthy()
        done()
      })
      .catch(done.fail)
  })

  it('Logout', function (done) {
    c.logout()

    expect(c.authenticator.authenticated).toBe(false)
    done()
  })
})

describe('Refresh Token', function () {
  let c = new MockupClient()

  it('Header: X-New-JWT-Token', function (done) {
    c.logout()
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
