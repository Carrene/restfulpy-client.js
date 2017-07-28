/**
 * Created by vahid on 7/13/17.
 */
import { MockupClient } from './helpers'

describe('Sorting', function () {
  it('Ascending', function (done) {
    let c = new MockupClient()
    c.request('resources').sort('id').send().then((resp) => {
      expect(resp.json.length).toEqual(10)
      expect(resp.json[0]['id']).toEqual(1)
      expect(resp.json[9]['id']).toEqual(10)
      done()
    })
  })
  it('Descending', function (done) {
    let c = new MockupClient()
    c.request('resources').sort('-id').send().then((resp) => {
      expect(resp.json.length).toEqual(10)
      expect(resp.json[0]['id']).toEqual(10)
      expect(resp.json[9]['id']).toEqual(1)
      done()
    })
  })
})
