import urljoin from 'url-join'

import { AuthenticationRequiredError } from './exceptions'
import Response from './response'
import { encodeQueryString } from './helpers'
import Deal from './deal'

export default class Request {
  constructor (client, resource = '', verb = 'get', payload = {}, headers = {}, queryString = [], encoding = 'json') {
    this.resource = resource
    this.client = client
    this.verb = verb
    this.payload = payload
    this.headers = headers
    this.queryString = queryString
    this.encoding = encoding
    this.postProcessor = null
  }

  setPostProcessor (processor) {
    this.postProcessor = processor
    return this
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

  addParameter (name, value) {
    let o = {}
    o[name] = value
    return this.addParameters(o)
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

  ifMatch (etag) {
    this.headers['If-Match'] = etag
    return this
  }

  ifNoneMatch (etag) {
    this.headers['If-None-Match'] = etag
    return this
  }

  done () {
    return new Deal((resolve, reject) => {
      let xhr = new window.XMLHttpRequest()
      let requestBody = ''

      xhr.onload = () => {
        let response = new Response(xhr)
        if (this.postProcessor) {
          this.postProcessor(response, resolve, reject)
        } else {
          resolve(response)
        }
      }
      xhr.onerror = () => {
        reject(new Response(xhr))
      }
      xhr.open(this.verb.toUpperCase(), this.composeUrl())

      for (let header in this.headers) {
        xhr.setRequestHeader(header, this.headers[header])
      }

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
