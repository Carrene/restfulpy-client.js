
import { AuthenticationRequiredError } from './exceptions'

export default class Request {
  constructor (context, payload) {
    this.context = context
    this.payload = payload || {}
    this.queryString = []
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
    return this
  }

  addParameters (parameters) {
    Object.assign(this.payload, parameters)
    return this
  }

  addQueryStringParameter (key, value, allowDuplicatedKeys = false) {
    if (!allowDuplicatedKeys) {
      for (let i of this.queryString) {
        if (key === i[0]) {
          i[1] = value
        }
      }
    } else {
      this.queryString.push([key, value])
    }
    return this
  }

  filter (field, expression) {
    this.addQueryStringParameter(field, expression, true)
    return this
  }

  take (take) {
    this.addQueryStringParameter('take', take)
    return this
  }

  skip (skip) {
    this.addQueryStringParameter('skip', skip)
    return this
  }

  sort (sort) {
    this.addAuthenticationHeaders('sort', sort)
    return this
  }



}
