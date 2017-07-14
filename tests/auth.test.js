/**
 * Created by vahid on 7/13/17.
 */
import { MockupClient } from './helpers'

describe('Authentication', function () {
  it('Login', function (done) {
    let c = new MockupClient()
    c.login({'email': 'user1@example.com', 'password': '123456'}).then(resp => {
      console.log(resp.json)
      expect(resp.json.token).not.toBe(null)
      done()
    }).catch(resp => {
      console.log('resp.error', resp)
      expect(resp.error).toBeNull()
      done()
    })
  })
})

