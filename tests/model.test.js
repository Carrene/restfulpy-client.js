/**
 * Created by vahid on 7/20/17.
 */
import { MockupClient } from './helpers'

describe('Model', function () {
  it('load', function (done) {
    let c = new MockupClient()
    const Resource = c.metadata.models.Resource
    c.loadMetadata({'Resource': {url: 'resources'}}).then(resps => {
      Resource.load('id', '<5').sort('id').done().done((resources, resp) => {
        expect(resources.length).toEqual(4)
        expect(resources[0].__status__).toEqual('loaded')
        expect(resources[0].constructor).toEqual(Resource)
        expect(resources[0])
        // expect(resp.status).toEqual(200)
        done()
      })
    })
  })
  it('loadOne', function (done) {
    let c = new MockupClient()
    const Resource = c.metadata.models.Resource
    c.loadMetadata({'Resource': {url: 'resources'}}).then(resps => {
      Resource.get('1').done().done((resource, resp) => {
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
    c.loadMetadata({'Resource': {url: 'resources'}}).then(resps => {
      // POST
      (new Resource({title: 'CRUD'})).save().done().done(newResource => {
        expect(newResource.__status__).toEqual('loaded')
        // GET
        Resource.get(newResource.id).done().done(resource => {
          expect(resource.title).toEqual('CRUD')
          expect(resource.__status__).toEqual('loaded')
          resource.title = 'CRUD(Updated)'
          expect(resource.__status__).toEqual('dirty')
          resource.title = 'CRUD'
          expect(resource.__status__).toEqual('loaded')
          resource.title = 'CRUD(Updated)'
          expect(resource.__status__).toEqual('dirty')
          // PUT
          resource.save().done().done(r => {
            expect(resource).toBe(r)
            expect(resource.__status__).toEqual('loaded')
            expect(resource.title).toEqual('CRUD(Updated)')

            // Reload (GET)
            resource.reload().done().done(rr => {
              expect(resource).toBe(rr)
              expect(resource.__status__).toEqual('loaded')
              // DELETE
              resource.delete().done().done(d => {
                expect(resource).toBe(d)
                expect(resource.__status__).toEqual('deleted')
                done()
              })
            })
          })
        })
      })
    })
  })
})

