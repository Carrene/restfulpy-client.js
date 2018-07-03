/**
 * Created by vahid on 7/20/17.
 */
import { MockupClient } from './helpers'

describe('Model', function () {
  it('load', function (done) {
    let c = new MockupClient()
    c.loadMetadata({'Resource': {url: 'resources'}}).then(resps => {
      const Resource = c.metadata.models.Resource
      Resource.load('id', '<5').sort('id').send().then(resp => {
        expect(resp.models.length).toEqual(4)
        expect(resp.models[0].__status__).toEqual('loaded')
        expect(resp.models[0].constructor).toEqual(Resource)
        expect(resp.models[0])
        expect(resp.status).toEqual(200)
        done()
      })
    })
  })
  it('loadOne', function (done) {
    let c = new MockupClient()
    c.loadMetadata({'Resource': {url: 'resources'}}).then(resps => {
      const Resource = c.metadata.models.Resource
      Resource.get('1').then((resp) => {
        expect(resp.models.__status__).toEqual('loaded')
        expect(resp.models.id).toEqual(1)
        expect(resp.models.title).toEqual('resource1')
        expect(resp.models.constructor).toEqual(Resource)
        expect(resp.models.resourcePath).toEqual('resources/1')
        expect(resp.status).toEqual(200)
        done()
      })
    })
  })
  it('loadOneByAbsolutePath', function (done) {
    let c = new MockupClient()
    c.loadMetadata({'Resource': {url: 'resources'}}).then(resps => {
      const Resource = c.metadata.models.Resource
      Resource.get('/resources/1').then((resp) => {
        expect(resp.models.__status__).toEqual('loaded')
        expect(resp.models.id).toEqual(1)
        expect(resp.models.title).toEqual('resource1')
        expect(resp.models.constructor).toEqual(Resource)
        expect(resp.models.resourcePath).toEqual('resources/1')
        expect(resp.status).toEqual(200)
        done()
      })
    })
  })
  it('CRUD', function (done) {
    let c = new MockupClient()
    c.loadMetadata({'Resource': {url: 'resources'}}).then(resps => {
      const Resource = c.metadata.models.Resource;
      // POST
      (new Resource({title: 'CRUD'})).save().send().then(newResource => {
        expect(newResource.__status__).toEqual('loaded')
        // GET
        Resource.get(newResource.id).then(resource => {
          expect(resource.title).toEqual('CRUD')
          expect(resource.__status__).toEqual('loaded')
          resource.title = 'CRUD(Updated)'
          expect(resource.__status__).toEqual('dirty')
          resource.title = 'CRUD'
          expect(resource.__status__).toEqual('loaded')
          resource.title = 'CRUD(Updated)'
          expect(resource.__status__).toEqual('dirty')
          // PUT
          resource.save().send().then(r => {
            expect(resource).toBe(r)
            expect(resource.__status__).toEqual('loaded')
            expect(resource.title).toEqual('CRUD(Updated)')

            // Reload (GET)
            resource.reload().send().then(rr => {
              expect(resource).toBe(rr)
              expect(resource.__status__).toEqual('loaded')
              // DELETE
              resource.delete().send().then(d => {
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

