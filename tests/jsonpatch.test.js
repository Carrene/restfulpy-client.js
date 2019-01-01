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
        expect(resp.status).toEqual(200)
        expect(resp.json.length).toEqual(2)
        expect(resp.json[0].length).toEqual(10)
        expect(resp.json[1].length).toEqual(10)
        done()
      })
      .catch(done.fail)
  })
})
