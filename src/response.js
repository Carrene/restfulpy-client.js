export default class Response {
  constructor (request, xhr) {
    this.request = request
    this.xhr = xhr
    this._json = null
    this._models = null
  }

  get status () {
    return this.xhr.status
  }

  getHeader (key) {
    return this.xhr.getResponseHeader(key)
  }

  get body () {
    return this.status !== 200 ? null : this.xhr.responseText
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

  get models () {
    if (this._models === null) {
      let jsons = [].concat(this.json)
      // if (Array.isArray(this.request)) {
      //   for (let request of this.request) {
      //     let newStatus = 'loaded'
      //     if (request.verb === request.ModelClass.__verbs__.delete) {
      //       newStatus = 'deleted'
      //     }
      //     this._models = jsons.map(
      //       json =>
      //         new request.ModelClass(
      //           request.ModelClass.decodeJson(json),
      //           newStatus
      //         )
      //     )
      //   }
      // } else {
      let newStatus = 'loaded'
      if (this.request.verb === this.request.ModelClass.__verbs__.delete) {
        newStatus = 'deleted'
      }
      this._models = jsons.map(
        json =>
          new this.request.ModelClass(
            this.request.ModelClass.decodeJson(json),
            newStatus
          )
      )
      // }
    }
    return this._models
  }

  get error () {
    return this.status === 200 ? null : this.xhr.statusText
  }

  get stackTrace () {
    if (
      String(this.xhr.status).match(
        this.request.client.errorHandlers.unhandledErrors
      )
    ) {
      if (this.xhr.getResponseHeader('ContentType') === 'application/json') {
        return JSON.parse(this.xhr.responseText).stackTrace
      } else if (this.xhr.getResponseHeader('ContentType') === 'text/plain') {
        return this.xhr.responseText
      } else {
        return `${this.xhr.getResponseHeader(
          'ContentType'
        )} content type is not supported`
      }
    }
  }

  static fromXhr (xhr) {
    if (xhr.getResponseHeader('X-Pagination-Count')) {
      return new PagedResponse(xhr)
    }
    return new Response(xhr)
  }
}

export class PagedResponse extends Response {
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
