/**
 * Created by vahid on 7/9/17.
 */

import { MockupClient } from './helpers'

describe('Filtering', function () {
  /* Testing single criterion */
  it('Simple filter', function (done) {
    let c = new MockupClient()
    c.request('resources').filter('id', 1).done().then((resp) => {
      expect(resp.json.length).toEqual(1)
      expect(resp.json[0]).toEqual({id: 1, title: 'resource1'})
      done()
    })
  })
  /* Testing multiple criteria */
  it('Multiple filter', function (done) {
    let c = new MockupClient()
    c.request('resources').filter('id', 1).filter('title', 'resource1').done().then((resp) => {
      expect(resp.json.length).toEqual(1)
      expect(resp.json[0]).toEqual({id: 1, title: 'resource1'})
      done()
    })
  })

  /* Testing multiple criteria */
  it('Greater than filter', function (done) {
    let c = new MockupClient()
    c.request('resources').filter('id', '<5').done().then((resp) => {
      expect(resp.json.length).toEqual(4)
      done()
    })
  })
})
