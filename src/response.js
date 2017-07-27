
export default class Response {
  constructor (xhr) {
    this.xhr = xhr
    this._json = null
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
    if (this._json === null) {
      this._json = JSON.parse(this.body)
    }
    return this._json
  }

  get error () {
    return (this.status === 200) ? null : this.xhr.responseText
  }

  get totalCount () {
    return this.getHeader('X-Pagination-Count')
  }

  get take () {
    return this.getHeader('X-Pagination-Take')
  }

  get skip () {
    return this.getHeader('X-Pagination-Skip')
  }
}

