import urljoin from 'url-join'

import { AuthenticationRequiredError } from './exceptions'
import Response from './response'

export default class Request {
  constructor (client, resource = '', verb = 'get', payload = {}, headers = {}, queryString = []) {
    this.resource = resource
    this.client = client
    this.verb = verb
    this.payload = payload
    this.headers = headers
    this.queryString = queryString
  }

  setVerb (verb) {
    this.verb = verb
    return this
  }

  addAuthenticationHeaders (force = false) {
    if (this.client.authenticator.authenticated) {
      this.client.authenticator.addAuthenticationHeaders(this)
    } else if (force) {
      throw new AuthenticationRequiredError()
    }
    return this
  }

  removeAuthenticationHeaders () {
    this.client.authenticator.removeAuthenticationHeaders(this)
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
    this.addQueryStringParameter('sort', sort)
    return this
  }

  get url () {
    return urljoin(this.client.baseUrl, this.resource)
  }

  done () {
    return new Promise((resolve, reject) => {
      let xhr = new window.XMLHttpRequest()
      xhr.onload = () => {
        resolve(new Response(xhr))
      }
      xhr.onerror = () => {
        reject(new Response(xhr))
      }
      xhr.open(this.verb.toUpperCase(), this.url)
      xhr.send()
    })
  }
}
