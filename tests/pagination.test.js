/**
 * Created by vahid on 7/13/17.
 */

import { MockupClient } from './helpers'

describe('Pagination', function () {
  it('First page', function (done) {
    let c = new MockupClient()
    c.request('resources').sort('id').take(3).done().then((resp) => {
      expect(resp.json.length).toEqual(3)
      expect(resp.json[0]['id']).toEqual(1)
      done()
    })
  })
  it('Second page', function (done) {
    let c = new MockupClient()
    c.request('resources').sort('id').skip(3).take(3).done().then((resp) => {
      expect(resp.json.length).toEqual(3)
      expect(resp.json[0]['id']).toEqual(4)
      done()
    })
  })
  it('Third page', function (done) {
    let c = new MockupClient()
    c.request('resources').sort('id').skip(6).take(3).done().then((resp) => {
      expect(resp.json.length).toEqual(3)
      expect(resp.json[0]['id']).toEqual(7)
      done()
    })
  })
  it('Last page', function (done) {
    let c = new MockupClient()
    c.request('resources').sort('id').skip(9).take(3).done().then((resp) => {
      expect(resp.json.length).toEqual(1)
      expect(resp.json[0]['id']).toEqual(10)
      done()
    })
  })
})
