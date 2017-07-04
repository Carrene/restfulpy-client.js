
import { AlreadyAuthenticatedError } from './exceptions.js'
import Authenticator from './authentication.js'
import Request from './request.js'

export default class RestfulpyClient {
  constructor (baseUrl, tokenHeaderKey = 'token', tokenLocalStorageKey = 'token', authenticator) {
    this.url = baseUrl
    this.tokenHeaderKey = tokenHeaderKey
    this.tokenLocalStorageKey = tokenLocalStorageKey
    this._authenticator = authenticator
  }

  createAuthenticator () {
    return new Authenticator()
  }

  get authenticator () {
    /* Singleton and Lazy-Initialization of the Authenticator object */
    if (this._authenticator === undefined) {
      this._authenticator = this.createAuthenticator()
    }
    return this._authenticator
  }

  request () {
    let request = new Request(this)
    if (this.authenticator.authenticated) {
      this.authenticator.setupRequest(request)
    }
    return request
  }

  login (credentials) {
    if (this.authenticator.authenticated) {
      throw AlreadyAuthenticatedError()
    }
    let token = this.request()
  }
}
