import { AlreadyAuthenticatedError, BadCredentialsError } from './exceptions'
import Authenticator from './authentication'
import Request from './request'
import JsonPatchRequest from './jsonpatch'
import Metadata from './metadata'

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
      this._authenticator = this.constructor.createAuthenticator()
    }
    return this._authenticator
  }

  request (...kwargs) {
    return new Request(this, ...kwargs).addAuthenticationHeaders(false)
  }

  jsonPatchRequest (...kwargs) {
    return new JsonPatchRequest(this, ...kwargs).addAuthenticationHeaders(false)
  }

  static validateCredentials (credentials) {
    if (credentials === null || credentials === undefined) {
      throw new BadCredentialsError()
    }
    return credentials
  }

  login (credentials) {
    if (this.authenticator.authenticated) {
      throw new AlreadyAuthenticatedError()
    }
    return new Promise((resolve, reject) => {
      this.request('sessions', 'POST')
        .addParameters(this.constructor.validateCredentials(credentials))
        .send() // Returns a promise
        .then((resp) => {
          this.authenticator.token = resp.json['token']
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

  loadMetadata (entities) {
    window.__restfulpy_metadata__ = new Metadata()
    return window.__restfulpy_metadata__.load(this, entities)
  }

  get metadata () {
    return window.__restfulpy_metadata__
  }
}
