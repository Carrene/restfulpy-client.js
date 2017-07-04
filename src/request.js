
import { AuthenticationRequiredError } from './exceptions'

export default class Request {
  constructor (context) {
    this.context = context
  }

  addAuthenticationHeaders (force = false) {
    if (this.context.authenticator.authenticated) {
      this.context.authenticator.addAuthenticationHeaders(this)
    } else if (force) {
      throw new AuthenticationRequiredError()
    }
    return this
  }

  removeAuthenticationHeaders () {
    this.context.authenticator.removeAuthenticationHeaders(this)
  }

}
