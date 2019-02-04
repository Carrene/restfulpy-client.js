/**
 * Created by vahid on 7/9/17.
 */

import { MockupClient } from './helpers'

describe('JsonPatch', function () {
  /* Testing json payload in both request & response */
  it('jsonpatch', function (done) {
    let c = new MockupClient()
    c.jsonPatchRequest('resources')
      .addRequest('', 'get')
      .addRequest('', 'get')
      .send()
      .then(resp => {
        expect(resp[0].status).toEqual(200)
        expect(resp[0].json.length).toEqual(10)
        expect(resp[1].json.length).toEqual(10)
        done()
      })
      .catch(done.fail)
  })

  it('jsonpatch error', function (done) {
    let c = new MockupClient()
    c.jsonPatchRequest('internal_error')
      .addRequest('', 'get')
      .send()
      .then(done.fail)
      .catch(err => {
        expect(err[0].error === 'Internal server error')
        done()
      })
  })
})
