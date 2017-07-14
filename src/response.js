
export default class Response {
  constructor (xhr) {
    this.xhr = xhr
  }

  get status () {
    return this.xhr.status
  }

  getHeader (key) {
    return this.xhr.getResponseHeader(key)
  }

  get body () {
    return (this.status !== 200) ? null : this.xhr.responseText
  }

  get identity () {
    return this.xhr.getResponseHeader('X-Identity')
  }

  get authenticated () {
    return this.identity !== null
  }

  get json () {
    return JSON.parse(this.body)
  }

  get error () {
    return (this.status === 200) ? null : this.xhr.responseText
  }
}

