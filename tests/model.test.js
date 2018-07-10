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
      (new Resource({title: 'CRUD'})).save().send().then(newResponse => {
        expect(newResponse.models.__status__).toEqual('loaded')
        expect(newResponse.status).toEqual(200)
        // GET
        Resource.get(newResponse.models.id).then(getResponse => {
          expect(getResponse.models.title).toEqual('CRUD')
          expect(getResponse.models.__status__).toEqual('loaded')
          getResponse.models.title = 'CRUD(Updated)'
          expect(getResponse.models.__status__).toEqual('dirty')
          getResponse.models.title = 'CRUD'
          expect(getResponse.models.__status__).toEqual('loaded')
          getResponse.models.title = 'CRUD(Updated)'
          expect(getResponse.models.__status__).toEqual('dirty')
          expect(getResponse.status).toEqual(200)
          // PUT
          getResponse.save().send().then(saveResponse => {
            expect(getResponse.models).toBe(saveResponse.models)
            expect(getResponse.models.__status__).toEqual('loaded')
            expect(getResponse.models.title).toEqual('CRUD(Updated)')
            expect(saveResponse.status).toEqual(200)

            // Reload (GET)
            getResponse.reload().send().then(reloadResponse => {
              expect(getResponse.models).toBe(reloadResponse.models)
              expect(getResponse.models.__status__).toEqual('loaded')
              expect(reloadResponse.status).toEqual(200)
              // DELETE
              getResponse.delete().send().then(deleteResponse => {
                expect(getResponse.models).toBe(deleteResponse.models)
                expect(getResponse.models.__status__).toEqual('deleted')
                expect(deleteResponse.status).toEqual(200)
                done()
              })
            })
          })
        })
      })
    })
  })
})

