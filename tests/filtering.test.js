/**
 * Created by vahid on 7/9/17.
 */

import { MockupClient } from './helpers'

describe('Filtering', function () {
  /* Testing json payload in both request & response */
  it('Simple filter', function (done) {
    let c = new MockupClient()
    c.request('resources').filter('id', 1).done().then((resp) => {
      expect(resp.json.length).toEqual(1)
      done()
    })
  })
})
