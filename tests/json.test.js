/**
 * Created by vahid on 7/9/17.
 */

import { MockupClient } from './helpers'

describe('Client', function () {
  /* Testing json payload in both request & response */
  it('Json echo', function (done) {
    let c = new MockupClient()
    let requestPayload = {item1: 'value1'}
    c.request('echo', 'post').addParameters(requestPayload).done().then((resp) => {
      expect(resp.status).toEqual(200)
      expect(resp.json()).toEqual(requestPayload)
      expect(resp.getHeader('Content-Type')).toEqual('application/json; charset=utf-8')
      done()
    })
  })

  /* Query String */
  it('Query String echo', function (done) {
    let c = new MockupClient()
    c.request('echo').addQueryString('item1', 'value1').done().then((resp) => {
      expect(resp.json()).toEqual({item1: 'value1'})
      done()
    })
  })

  it('Query String and payload echo', function (done) {
    let c = new MockupClient()
    c.request('echo', 'post').addParameters({item1: 'value1'}).addQueryString('item2', 'value2').done().then((resp) => {
      expect(resp.json()).toEqual({item1: 'value1', item2: 'value2'})
      done()
    })
  })
})
