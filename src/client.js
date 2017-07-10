import { AlreadyAuthenticatedError, BadCredentialsError } from './exceptions'
import Authenticator from './authentication'
import Request from './request'

export default class RestfulpyClient {
  constructor (baseUrl, tokenLocalStorageKey = 'token', authenticator) {
    this.baseUrl = baseUrl
    this.tokenLocalStorageKey = tokenLocalStorageKey
    this._authenticator = authenticator
  }

  static createAuthenticator () {
    return new Authenticator()
  }

  get authenticator () {
    /* Singleton and Lazy-Initialization of the Authenticator object */
    if (this._authenticator === undefined) {
      console.log(this)
      this._authenticator = this.constructor.createAuthenticator()
    }
    return this._authenticator
  }

  createRequest (...kwargs) {
    return new Request(this, ...kwargs)
  }

  request (...kwargs) {
    return this.createRequest(...kwargs).addAuthenticationHeaders(false)
  }

  static validateCredentials (credentials) {
    if (credentials === null || credentials === undefined) {
      throw new BadCredentialsError()
    }
    return credentials
  }

  login (credentials) {
    if (this.authenticator.authenticated) {
      throw AlreadyAuthenticatedError()
    }
    return new Promise((resolve, reject) => {
      this.request()
        .addParameters(this.constructor.validateCredentials(credentials))
        .done() // Returns a promise
        .then((resp) => {
          this.authenticator.token = resp['token']
          resolve(resp)
        })
        .catch((resp) => {
          this.authenticator.deleteToken()
          reject(resp)
        })
    })
  }

  logout () {
    this.authenticator.deleteToken()
  }
}
