import urljoin from 'url-join'

import { AuthenticationRequiredError, InvalidOperationError } from './exceptions'
import { encodeQueryString } from './helpers'
import doHttpRequest from './http'

export default class Request {
  constructor (
    client,
    resource = '',
    verb = 'get',
    payload = {},
    headers = {},
    queryString = [],
    encoding = 'json',
    withCredentials = true
  ) {
    this.resource = resource
    this.client = client
    this.verb = verb
    this.payload = payload
    this.headers = headers
    this.queryString = queryString
    this.encoding = encoding
    this.postProcessor = null
    this.xhrWithCredentials = withCredentials
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

  addHeader (name, value) {
    let o = {}
    o[name] = value
    return this.addHeaders(o)
  }

  addHeaders (headers) {
    Object.assign(this.headers, headers)
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
    if (field === undefined) {
      return this
    }

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

  withCredentials () {
    if (this.xhrWithCredentials) {
      throw new InvalidOperationError()
    }
    this.xhrWithCredentials = true
  }

  withoutCredentials () {
    if (!this.xhrWithCredentials) {
      throw new InvalidOperationError()
    }
    this.xhrWithCredentials = false
  }

  send () {
    return doHttpRequest(this.composeUrl(), {
      payload: this.payload,
      verb: this.verb,
      headers: this.headers,
      encoding: this.encoding,
      postProcessor: this.postProcessor,
      xhrWithCredentials: this.xhrWithCredentials
    })
  }
}
