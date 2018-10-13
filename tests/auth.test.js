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

  it('Logout', function () {
    c.logout()
    expect(c.authenticator.authenticated).toBe(false)
  })

  it('Refresh Token', function (done) {
    c.login({'email': 'user1@example.com', 'password': '123456'}).then(resp => {
      let previousToken = resp.json.token
      c.request('sessions').setVerb('RENEW').send().then(response => {
        let currentToken = response.getHeader(c.authenticator.tokenResponseHeaderKey)
        expect(currentToken).not.toBe(null)
        expect(currentToken).not.toEqual(previousToken)
        done()
      })
    }).catch(resp => {
      done()
      throw resp.error
    })
  })
})
