/**
 * Created by vahid on 7/14/17.
 */

import Request from './request'

export default class JsonPatchRequest extends Request {
  constructor (client, resource = '', headers = {}, queryString = []) {
    super(client, resource, 'PATCH', [], headers, queryString, 'json')
  }

  addRequest (resource, verb, payload = null) {
    this.payload.push({path: resource, op: verb, value: payload})
    return this
  }
}
