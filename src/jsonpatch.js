/**
 * Created by vahid on 7/14/17.
 */

import Request from './request'
import Response from './response'

class FakeXHR {
  constructor (index, xhr) {
    this.xhr = xhr
    this.index = index
  }

  get responseText () {
    return JSON.stringify(JSON.parse(this.xhr.responseText)[this.index])
  }

  get status () {
    return this.xhr.status
  }

  get statusText () {
    return this.xhr.statusText
  }

  getResponseHeader (header) {
    return this.xhr.getResponseHeader(header)
  }
}

export default class JsonPatchRequest extends Request {
  constructor (client, resource = '', headers = {}, queryString = []) {
    super(client, resource, 'PATCH', [], headers, queryString, 'json')
    this.requests = []
  }

  addRequest (resourceOrRequest, verb, payload = null) {
    if (resourceOrRequest instanceof Request) {
      let regex = `(${this.resource})(/(.*))?`
      regex = new RegExp(regex)
      let pathMatch = resourceOrRequest.resource.match(regex)
      this.requests.push(resourceOrRequest)
      this.payload.push({
        path: pathMatch[0] ? pathMatch[3] || '' : resourceOrRequest.resource,
        op: resourceOrRequest.verb.toLowerCase(),
        value: resourceOrRequest.payload
      })
    } else {
      let payloadJson = payload ? payload.toJson() : null
      let request = new Request(resourceOrRequest, verb, payloadJson)
      this.requests.push(request)
      this.payload.push({
        path: resourceOrRequest,
        op: verb.toLowerCase(),
        value: payload
      })
    }
    return this
  }

  responseFactory (...args) {
    let responses = []
    for (let index in this.requests) {
      responses.push(
        Response.fromXhr(this.requests[index], new FakeXHR(index, ...args))
      )
    }
    return responses
  }
}
