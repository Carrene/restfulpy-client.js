
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

  static fromXhr (xhr) {
    if (xhr.getResponseHeader('X-Pagination-Count')) {
      return new PagedResponse(xhr)
    }
    return new Response(xhr)
  }

}

class PagedResponse extends Response {
  get totalCount () {
    return parseInt(this.getHeader('X-Pagination-Count'))
  }

  get take () {
    return parseInt(this.getHeader('X-Pagination-Take'))
  }

  get skip () {
    return parseInt(this.getHeader('X-Pagination-Skip'))
  }

  get pageIndex () {
    return Math.floor(this.skip / this.take)
  }

  get pageSize () {
    return this.take
  }

  get totalPages () {
    return Math.floor(this.totalCount / this.take) + 1
  }
}
