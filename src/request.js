import urljoin from 'url-join'

import { AuthenticationRequiredError } from './exceptions'
import Response from './response'
import { encodeQueryString } from './helpers'

export default class Request {
  constructor (client, resource = '', verb = 'get', payload = {}, headers = {}, queryString = [], encoding = 'json') {
    this.resource = resource
    this.client = client
    this.verb = verb
    this.payload = payload
    this.headers = headers
    this.queryString = queryString
    this.encoding = encoding
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

  addQueryString (key, value, allowDuplicatedKeys = false) {
    let found = false
    if (!allowDuplicatedKeys) {
      for (let i of this.queryString) {
        if (key === i[0]) {
          i[1] = value
          found = true
          break
        }
      }
    }
    if (!found) {
      this.queryString.push([key, value])
    }
    return this
  }

  filter (field, expression) {
    // TODO: Accept dict as first argument
    console.log('************** Field', typeof field, field)
    if (typeof field === 'object') {
      for (let i in field) {
        console.log('##### Field', i, field[i])
        this.addQueryString(i, field[i], true)
      }
    } else {
      this.addQueryString(field, expression, true)
    }
    return this
  }

  take (take) {
    this.addQueryString('take', take)
    return this
  }

  skip (skip) {
    this.addQueryString('skip', skip)
    return this
  }

  sort (sort) {
    this.addQueryString('sort', sort)
    return this
  }

  get url () {
    return urljoin(this.client.baseUrl, this.resource)
  }

  composeUrl () {
    let url = this.url
    if (this.queryString.length) {
      url += `?${encodeQueryString(this.queryString)}`
    }
    return url
  }

  done () {
    return new Promise((resolve, reject) => {
      let xhr = new window.XMLHttpRequest()
      let requestBody = ''

      xhr.onload = () => {
        resolve(new Response(xhr))
      }
      xhr.onerror = () => {
        let resp = new Response(xhr)
        console.log(resp.error)
        reject(resp)
      }
      xhr.open(this.verb.toUpperCase(), this.composeUrl())

      if (this.encoding === 'json') {
        requestBody = JSON.stringify(this.payload)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      } else {
        throw new Error(`encoding: ${this.encoding} is not supported.`)
      }
      xhr.send(requestBody)
    })
  }
}
