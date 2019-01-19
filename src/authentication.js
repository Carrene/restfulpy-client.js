import jwtDecode from 'jwt-decode'
import {
  AbstractBaseClassError,
  AuthenticationRequiredError,
  BadCredentialsError,
  MethodMustOverrideError
} from './exceptions'

export default class AbstractAuthenticator {
  constructor (
    tokenRequestHeaderKey = 'Authorization',
    tokenLocalStorageKey = 'token',
    tokenResponseHeaderKey = 'X-New-JWT-Token'
  ) {
    if (new.target === AbstractAuthenticator) {
      throw new AbstractBaseClassError(this.constructor)
    }
    this.tokenRequestHeaderKey = tokenRequestHeaderKey
    this.tokenLocalStorageKey = tokenLocalStorageKey
    this.tokenResponseHeaderKey = tokenResponseHeaderKey
    this._member = null
  }

  get token () {
    return window.localStorage.getItem(this.tokenLocalStorageKey)
  }

  set token (token) {
    if (!token) {
      return this.deleteToken()
    }
    try {
      this.member = jwtDecode(token)
      window.localStorage.setItem(this.tokenLocalStorageKey, token)
    } catch (ex) {
      this.deleteToken()
    }
  }

  restoreFromLocalStorage () {
    let token = this.token
    if (token === null) {
      return
    }
    this._member = jwtDecode(token)
  }

  get member () {
    if (this._member === null) {
      this.restoreFromLocalStorage()
    }
    return this._member
  }

  set member (v) {
    this._member = v
  }

  get authenticated () {
    return this.member !== null
  }

  addAuthenticationHeaders (request) {
    if (!this.authenticated) {
      throw new AuthenticationRequiredError()
    }
    if (request.verb !== 'METADATA') {
      request.addHeader(this.tokenRequestHeaderKey, `Bearer ${this.token}`)
    }
  }

  deleteToken (done) {
    window.localStorage.removeItem(this.tokenLocalStorageKey)
    this.member = null
    if (done !== undefined) {
      done()
    }
  }

  checkResponse (response) {
    let token = response.getHeader(this.tokenResponseHeaderKey)
    if (token) {
      this.token = token
    }
  }

  isInRole (role) {
    if (!this.authenticated) {
      throw new AuthenticationRequiredError()
    }
    for (let r of this.member.roles) {
      if (r === role) {
        return true
      }
    }
    return false
  }

  login (credentials) {
    throw new MethodMustOverrideError()
  }

  logout (done) {
    throw new MethodMustOverrideError()
  }

  static validateCredentials (credentials) {
    if (credentials === null || credentials === undefined) {
      throw new BadCredentialsError()
    }
    return credentials
  }
}
