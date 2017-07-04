
import { NotImplementedYetButShouldBeImplementedSoon } from './exceptions.js'
import Authenticator from './authentication.js'

export class RestfulpyClient {
  constructor (url, tokenHeaderKey = 'token', tokenLocalStorageKey = 'token', authenticator) {
    this.url = url
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
    throw new NotImplementedYetButShouldBeImplementedSoon()
  }

  login (credentials) {
    throw new NotImplementedYetButShouldBeImplementedSoon()
  }

}
