/**
 * Created by vahid on 7/9/17.
 */

import { MockupClient } from './helpers'

describe('Form', function () {
  /* Testing no payload */
  it('No payload', function (done) {
    let c = new MockupClient()
    c.request('resources/1').send().then((resp) => {
      expect(resp.status).toEqual(200)
      done()
    }).catch(resp => {
      console.log('ERROR', resp)
      done()
    })
  })

  /* Testing json payload in both request & response */
  it('Json echo', function (done) {
    let c = new MockupClient()
    let requestPayload = {item1: 'value1'}
    c.request('echo', 'post').addParameters(requestPayload).send().then((resp) => {
      expect(resp.status).toEqual(200)
      expect(resp.json).toEqual(requestPayload)
      expect(resp.getHeader('Content-Type')).toEqual('application/json; charset=utf-8')
      done()
    }).catch(resp => {
      console.log('ERROR', resp)
      done()
    })
  })

  /* Query String */
  it('Query String echo', function (done) {
    let c = new MockupClient()
    c.request('echo').addQueryString('item1', 'value1').send().then((resp) => {
      expect(resp.json).toEqual({item1: 'value1'})
      done()
    }).catch(resp => {
      console.log('ERROR', resp)
      done()
    })
  })

  it('Query String and payload echo', function (done) {
    let c = new MockupClient()
    c.request('echo', 'post').addParameters({item1: 'value1'}).addQueryString('item2', 'value2').send().then((resp) => {
      expect(resp.json).toEqual({item1: 'value1', item2: 'value2'})
      done()
    }).catch(resp => {
      console.log('ERROR', resp)
      done()
    })
  })

  it('UrlEncoded', function (done) {
    let c = new MockupClient()
    let requestPayload = {item1: 'value1'}
    c.request('echo', 'post').setEncoding('urlencoded').addParameters(requestPayload).send().then((resp) => {
      expect(resp.json).toEqual(requestPayload)
      done()
    }).catch(resp => {
      console.log('ERROR', resp)
      done()
    })
  })

  it('Multipart', function (done) {
    let c = new MockupClient()
    let requestPayload = {item1: 'value1', item2: 'value2'}
    c.request('echo', 'post').setEncoding('multipart').addParameters(requestPayload).send().then((resp) => {
      expect(resp.json).toEqual(requestPayload)
      done()
    }).catch(resp => {
      console.log('ERROR', resp)
      done()
    })
  })
})
