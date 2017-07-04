
module.exports = httpHeaders = {}

class ResponseMetadata {
  constructor (xhr) {
    this.xhr = xhr
  }
  get totalCount () {
    return parseInt(this.xhr.getResponseHeader('X-Pagination-Count'))
  }

  get pageSize () {
    return parseInt(this.xhr.getResponseHeader('X-Pagination-Take'))
  }

  get pageIndex () {
    return Math.floor(parseInt(this.xhr.getResponseHeader('X-Pagination-Skip')) / this.pageSize)
  }

  get totalPages () {
    return Math.ceil(this.totalCount / this.pageSize)
  }
}

module.exports = class APIClient {
  constructor (vm, version, entity, baseurl) {
    this.url = `${baseurl}/${version}/${entity}`
    this.vm = vm
    this.status = ''
    this.message = ''
  }
  request (verb, data, options) {
    var self = this
    if (!options) {
      options = {}
    }
    var success = options.success
    var error = options.error

    jQuery.extend(options, {
      method: verb,
      data: data,
      headers: httpHeaders,
      dataType: 'json',
      success (data, textStatus, xhr) {
        auth.checkResponse(xhr)
        self.status = xhr.status
        if (success) {
          success.bind(self.vm)(data, new ResponseMetadata(xhr))
        }
      },
      error (xhr, textStatus, err) {
        auth.checkResponse(xhr)
        self.status = xhr.status
        if (error) {
          error.bind(self.vm)(err, xhr)
        }
      },
      xhrFields: {
        withCredentials: true // FIXME: send only on development env
      }
    })

    jQuery.ajax(`${this.url}${!options.path ? '' : options.path}`, options)
  }
  get (data, options) {
    this.request('get', data, options)
  }
  post (data, options) {
    this.request('post', data, options)
  }
  put (data, options) {
    this.request('put', data, options)
  }
  delete_ (data, options) {
    this.request('delete', data, options)
  }
  patch (data, options) {
    this.request('patch', data, options)
  }
  undelete (data, options) {
    this.request('undelete', data, options)
  }
  // Promises
  $request (verb, data, options) {
    return new Promise((resolve, reject) => this.request(verb, data, jQuery.extend({}, options, {
      success (resp) {
        resolve(resp)
      },
      error (resp) {
        reject(resp)
      }
    })))
  }
  $post (data, options) {
    return this.$request('post', data, options)
  }
  $get (data, options) {
    return this.$request('get', data, options)
  }
  $put (data, options) {
    return this.$request('put', data, options)
  }
  $patch (data, options) {
    return this.$request('patch', data, options)
  }
  $delete (data, options) {
    return this.$request('delete', data, options)
  }
  $undelete (data, options) {
    return this.$request('undelete', data, options)
  }
}
