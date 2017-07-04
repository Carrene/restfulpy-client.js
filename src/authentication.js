const jwtDecode = require('jwt-decode')

export default class Authenticator {
  constructor (tokenRequestHeaderKey = 'Authorization', tokenLocalStorageKey = 'token') {
    this.tokenRequestHeaderKey = tokenRequestHeaderKey
    this.tokenLocalStorageKey = tokenLocalStorageKey
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

  setupRequest (request) {
    request.headers[this.tokenRequestHeaderKey] = `Bearer ${this.token}`
  }

  deleteToken () {
    this.member = null
    window.localStorage.removeItem(this.tokenLocalStorageKey)
  }
}