
import { MockupClient } from './helpers'

describe('Filtering Sorting Pagination', function () {
  it('LIKE filter Descending Second page', function (done) {
    let c = new MockupClient()
    c.request('resources').filter('title', '%resource').sort('-id').skip(3).take(3).send().then((resp) => {
      expect(resp.json.length).toEqual(3)
      expect(resp.json[0]['id']).toEqual(7)
      expect(resp.json[2]['id']).toEqual(5)
      done()
    })
  })
})
