
import jwtDecode from 'jwt-decode'
import { AuthenticationRequiredError } from './exceptions'

export default class Authenticator {
  constructor (tokenRequestHeaderKey = 'Authorization', tokenLocalStorageKey = 'token', tokenResponseHeaderKey = 'X-New-JWT-Token') {
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
    request.headers[this.tokenRequestHeaderKey] = `Bearer ${this.token}`
  }

  removeAuthenticationHeaders (request) {
    delete request.headers[this.tokenRequestHeaderKey]
  }

  deleteToken () {
    window.localStorage.removeItem(this.tokenLocalStorageKey)
    this.member = null
  }

  checkResponse (response) {
    let token = response.headers[this.tokenResponseHeaderKey]
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
}
