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
  it('loadOne', function (done) {
    let c = new MockupClient()
    const Resource = c.metadata.models.Resource
    c.loadMetadata({'Resource': {url: 'resources'}}).then((resps) => {
      Resource.get('1').then(resource => {
        expect(resource.__status__).toEqual('loaded')
        expect(resource.id).toEqual(1)
        expect(resource.title).toEqual('resource1')
        expect(resource.constructor).toEqual(Resource)
        done()
      })
    })
  })
  it('CRUD', function (done) {
    let c = new MockupClient()
    const Resource = c.metadata.models.Resource
    c.loadMetadata({'Resource': {url: 'resources'}}).then((resps) => {
      // GET
      Resource.get('1').then(resource => {
        expect(resource.title).toEqual('resource1')
        expect(resource.__status__).toEqual('loaded')
        resource.title = 'resource1(Updated)'
        expect(resource.__status__).toEqual('dirty')
        resource.title = 'resource1'
        expect(resource.__status__).toEqual('loaded')
        resource.title = 'resource1(Updated)'
        expect(resource.__status__).toEqual('dirty')
        // PUT
        resource.save().then(r => {
          expect(resource).toBe(r)
          expect(resource.__status__).toEqual('loaded')
          expect(resource.title).toEqual('resource1(Updated)')
          // DELETE
          resource.delete().then(d => {
            expect(resource).toBe(d)
            expect(resource.__status__).toEqual('deleted')
            done()
          })
        })
      })
    })
  })
})

