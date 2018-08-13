import { encodeQueryString } from './helpers'

export default function doHttpRequest (url, options, responseFactory) {
  let defaultOptions = {
    payload: {},
    verb: 'get',
    headers: {},
    encoding: 'json',
    postProcessor: null,
    xhrWithCredentials: true
  }
  Object.assign(defaultOptions, options)

  return new Promise((resolve, reject) => {
    let xhr = new window.XMLHttpRequest()
    let requestBody = ''

    xhr.onload = () => {
      let response = responseFactory(xhr)
      if (defaultOptions.postProcessor) {
        defaultOptions.postProcessor(response, resolve, reject)
      } else {
        resolve(response)
      }
    }
    xhr.onerror = () => {
      reject(responseFactory(xhr))
    }
    xhr.open(defaultOptions.verb.toUpperCase(), url)

    for (let header in defaultOptions.headers) {
      xhr.setRequestHeader(header, defaultOptions.headers[header])
    }

    if (defaultOptions.encoding === null) {
      requestBody = null
    } else if (defaultOptions.encoding === 'json') {
      requestBody = JSON.stringify(defaultOptions.payload)
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    } else if (defaultOptions.encoding === 'urlencoded') {
      requestBody = encodeQueryString(defaultOptions.payload)
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    } else if (defaultOptions.encoding === 'multipart') {
      requestBody = new window.FormData()
      for (let paramName in defaultOptions.payload) {
        let value = defaultOptions.payload[paramName]
        if (value instanceof window.File) {
          requestBody.append(paramName, value, value.name)
        } else if (value instanceof Array) {
          for (let file of value) {
            requestBody.append(paramName, file, file.name)
          }
        } else {
          requestBody.append(paramName, value)
        }
      }
      // Do not setting the content type for multipart
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    } else {
      throw new Error(`encoding: ${defaultOptions.encoding} is not supported.`)
    }
    xhr.withCredentials = defaultOptions.xhrWithCredentials
    xhr.send(requestBody)
  })
}
