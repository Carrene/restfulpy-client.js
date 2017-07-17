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

  setEncoding (encoding) {
    this.encoding = encoding
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
    if (typeof field === 'object') {
      for (let i in field) {
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
        console.log('HTTP OK', this.resource, this.verb, xhr.status)
        resolve(new Response(xhr))
      }
      xhr.onerror = () => {
        console.log('HTTP ERROR', this.resource, this.verb, xhr.status)
        let resp = new Response(xhr)
        reject(resp)
      }
      xhr.open(this.verb.toUpperCase(), this.composeUrl())
      if (this.encoding === 'json') {
        requestBody = JSON.stringify(this.payload)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      } else if (this.encoding === 'urlencoded') {
        requestBody = encodeQueryString(this.payload)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      } else if (this.encoding === 'multipart') {
        requestBody = new window.FormData()
        for (let paramName in this.payload) {
          let value = this.payload[paramName]
          if (value instanceof window.File) {
            requestBody.append(paramName, value, value.name)
          } else {
            requestBody.append(paramName, value)
          }
        }
        // Do not setting the content type for multipart
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data')
      } else {
        throw new Error(`encoding: ${this.encoding} is not supported.`)
      }
      xhr.send(requestBody)
    })
  }
}
