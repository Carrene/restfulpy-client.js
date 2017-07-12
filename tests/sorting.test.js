/**
 * Created by vahid on 7/13/17.
 */
import { MockupClient } from './helpers'

describe('Sorting', function () {
  it('Ascending', function (done) {
    let c = new MockupClient()
    c.request('resources').sort('id').done().then((resp) => {
      expect(resp.json.length).toEqual(10)
      expect(resp.json[0]).toEqual({id: 1, title: 'resource1'})
      expect(resp.json[9]).toEqual({id: 10, title: 'resource10'})
      done()
    })
  })
})
