import { AlreadyAuthenticatedError, InvalidOperationError } from './exceptions'
import Authenticator from './authentication'
import Request from './request'
import JsonPatchRequest from './jsonpatch'
import Metadata from './metadata'

export default class Session {
  constructor (baseUrl, tokenLocalStorageKey = 'token', authenticator, errorHandlers = {}) {
    this.baseUrl = baseUrl
    this.tokenLocalStorageKey = tokenLocalStorageKey
    this._authenticator = authenticator
    this.errorHandlers = errorHandlers
  }

  // FIXME: We have to remove this method because Authenticator is a abstract class and can't be
  // Instantiated. We have to force user to set the authenticator object.
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

  request (...args) {
    return new Request(this, ...args).setErrorHandlers(this.errorHandlers)
      .addAuthenticationHeaders(false)
  }

  requestModel (ModelClass, url, verb) {
    return this.request(url, verb).setModelClass(ModelClass)
  }

  jsonPatchRequest (...args) {
    return new JsonPatchRequest(this, ...args).addAuthenticationHeaders(false)
  }

  login (...args) {
    if (!this.authenticator) {
      throw new InvalidOperationError()
    }
    if (this.authenticator.authenticated) {
      throw new AlreadyAuthenticatedError()
    }
    return this.authenticator.login(...args)
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
