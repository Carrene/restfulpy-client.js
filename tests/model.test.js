/**
 * Created by vahid on 7/20/17.
 */
import { MockupClient } from './helpers'

describe('Model', function () {
  it('load', function (done) {
    let c = new MockupClient()
    const Resource = c.metadata.models.Resource
    c.loadMetadata({'Resource': {url: 'resources'}}).then((resps) => {
      Resource.load('id', '<5').then(resources => {
        expect(resources.length).toEqual(4)
        expect(resources[0].__status__).toEqual('loaded')
        expect(resources[0].constructor).toEqual(Resource)
        done()
      })
    })
  })
})

