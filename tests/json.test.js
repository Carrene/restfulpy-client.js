/**
 * Created by vahid on 7/9/17.
 */

import { MockupClient } from './helpers'

describe('client', function () {
  it('json echo', function (done) {
    let c = new MockupClient()
    let requestPayload = {item1: 'value1'}
    c.request('echo').addParameters(requestPayload).done().then((resp) => {
      console.log(resp)
      expect(resp.status, 200)
      done()
      // expect(resp.json, requestPayload)
    })
  })
})

