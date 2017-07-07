
import { AlreadyAuthenticatedError, BadCredentialsError } from './exceptions'
import Authenticator from './authentication'
import Request from './request'

export default class RestfulpyClient {
  constructor (baseUrl, tokenHeaderKey = 'token', tokenLocalStorageKey = 'token', tokenResponseKey = 'token', authenticator) {
    this.url = baseUrl
    this.tokenHeaderKey = tokenHeaderKey
    this.tokenResponseKey = tokenResponseKey
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

  createRequest () {
    return new Request(this)
  }

  request () {
    return this.createRequest().addAuthenticationHeaders(false)
  }

  validateCredentials (credentials) {
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
        .addParameters(this.validateCredentials(credentials))
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
