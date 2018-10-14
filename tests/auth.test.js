/**
 * Created by vahid on 7/13/17.
 */
import { MockupClient } from './helpers'

describe('Authentication', function () {
  let c = new MockupClient()

  it('Login', function (done) {
    c.login({'email': 'user1@example.com', 'password': '123456'}).then(resp => {
      expect(resp.json.token).not.toBe(null)
      expect(c.authenticator.authenticated).toBeTruthy()
      expect(c.authenticator.isInRole('user')).toBeTruthy()
      done()
    }).catch(resp => {
      done()
      throw resp.error
    })
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
    c.login({'email': 'user1@example.com', 'password': '123456'}).then(resp => {
      let previousToken = resp.json.token
      waitsFor('Renewing the token counter to ensure the new token is not the same',
        function () {
          c.request('sessions').setVerb('RENEW').send().then(response => {
            let currentToken = response.getHeader(c.authenticator.tokenResponseHeaderKey)
            debugger
            expect(currentToken).not.toBe(null)
            expect(currentToken).not.toEqual(previousToken)
            done()
          })
        }, 1001
      )
    }).catch(resp => {
      done()
      throw resp.error
    })
  })
})
