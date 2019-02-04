import {
  AlreadyAuthenticatedError,
  InvalidOperationError,
  MethodMustOverrideError
} from './exceptions'
import Request from './request'
import JsonPatchRequest from './jsonpatch'
import Metadata from './metadata'

export default class Session {
  constructor (
    baseUrl,
    tokenLocalStorageKey = 'token',
    authenticator,
    errorHandlers
  ) {
    this.baseUrl = baseUrl
    this.tokenLocalStorageKey = tokenLocalStorageKey
    this._authenticator = authenticator
    this.errorHandlers = Object.assign(
      {
        unhandledErrors: /5\d{2}/
      },
      errorHandlers
    )
  }

  onResponse (response) {
    if (this.authenticator) {
      this.authenticator.checkResponse(response)
    }
  }

  get authenticator () {
    return this._authenticator
  }

  request (...args) {
    return new Request(this, ...args)
      .setErrorHandlers(this.errorHandlers)
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
    this.authenticator.logout(done)
  }

  loadMetadata (entities) {
    throw new MethodMustOverrideError()
  }

  saveMetadata (entity) {
    throw new MethodMustOverrideError()
  }

  createMetadata () {
    return new Metadata()
  }

  get metadata () {
    throw new MethodMustOverrideError()
  }
}

export class BrowserSession extends Session {
  loadMetadata (entities) {
    let metadata = this.createMetadata()
    return metadata.load(this, entities).then(() => {
      this.saveMetadata(metadata)
    })
  }

  saveMetadata (metadata) {
    window.__restfulpy_metadata__ = window.__restfulpy_metadata__ || {}
    window.__restfulpy_metadata__[this.baseUrl] = metadata
  }

  get metadata () {
    return window.__restfulpy_metadata__[this.baseUrl]
  }
}
