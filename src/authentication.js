
import jwtDecode from 'jwt-decode'
import { AuthenticationRequiredError } from './exceptions'

export default class Authenticator {
  constructor (tokenRequestHeaderKey = 'Authorization', tokenLocalStorageKey = 'token',
               tokenResponseHeaderKey = 'X-New-JWT-Token') {
    this.tokenRequestHeaderKey = tokenRequestHeaderKey
    this.tokenLocalStorageKey = tokenLocalStorageKey
    this.tokenResponseHeaderKey = tokenResponseHeaderKey
    this.member = null
  }

  get token () {
    return window.localStorage.getItem(this.tokenLocalStorageKey)
  }

  set token (token) {
    if (!token) {
      return this.deleteToken()
    }
    try {
      this.member = Object.assign(this.member, jwtDecode(token))
      window.localStorage.setItem(this.tokenLocalStorageKey, token)
    } catch (ex) {
      this.deleteToken()
    }
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
    this.member = null
    window.localStorage.removeItem(this.tokenLocalStorageKey)
  }

  checkResponse (response) {
    let token = response.headers[this.tokenResponseHeaderKey]
    if (token) {
      this.token = token
    }
  }
}
