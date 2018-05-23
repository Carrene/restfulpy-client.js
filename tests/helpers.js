/**
 * Created by vahid on 7/11/17.
 */

import { default as Client, Authenticator } from 'restfulpy'

class MyAuthenticator extends Authenticator {
  login (credentials) {
    return new Promise((resolve, reject) => {
      this.request('sessions', 'POST')
        .addParameters(this.constructor.validateCredentials(credentials))
        .send() // Returns a promise
        .then((resp) => {
          this.token = resp.json['token']
          resolve(resp)
        })
        .catch((resp) => {
          this.deleteToken()
          reject(resp)
        })
    })
  }
}

let authenticator = new MyAuthenticator()

export class MockupClient extends Client {
  constructor () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    super(window.__karma__.config.serverUrl, 'token', authenticator)
  }
}
