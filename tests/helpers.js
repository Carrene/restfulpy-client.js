/**
 * Created by vahid on 7/11/17.
 */

import { default as Client, Authenticator, httpClient, Response } from 'restfulpy'

let BASE_URL = window.__karma__.config.serverUrl

class MyAuthenticator extends Authenticator {
  login (credentials) {
    return httpClient(`${BASE_URL}/sessions`, {
      verb: 'POST',
      payload: this.constructor.validateCredentials(credentials)
    }, (...args) => {
      return new Response(null, ...args)
    }).then(resp => {
      this.token = resp.json.token
      return Promise.resolve(resp)
    }).catch((resp) => {
      this.deleteToken()
      return Promise.reject(resp)
    })
  }
}

let authenticator = new MyAuthenticator()

// We can not change actual window.location.href in a test runner. so we fake it!
let fakeWindow = {
  location: new URL(window.location.href)
}
const errorHandler = {
  401: (status, redirectUrl) => {
    if (status === 401) {
      fakeWindow.location.href = `${window.location.origin}/login?redirect=${BASE_URL}/${redirectUrl}`
    }
  }
}

export class MockupClient extends Client {
  constructor () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    super(BASE_URL, 'token', authenticator, errorHandler)
  }
}

export { fakeWindow }
