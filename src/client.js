import { AlreadyAuthenticatedError, InvalidOperationError } from './exceptions'
import Authenticator from './authentication'
import Request from './request'
import JsonPatchRequest from './jsonpatch'
import Metadata from './metadata'

export default class Session {
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

  login (...kwargs) {
    if (!this.authenticator) {
      throw new InvalidOperationError()
    }
    if (this.authenticator.authenticated) {
      throw new AlreadyAuthenticatedError()
    }
    return this.authenticator.login(...kwargs)
  }

  logout (done) {
    this.authenticator.deleteToken(done)
  }

  loadMetadata (entities) {
    window.__restfulpy_metadata__ = new Metadata()
    return window.__restfulpy_metadata__.load(this, entities)
  }

  get metadata () {
    return window.__restfulpy_metadata__
  }
}
