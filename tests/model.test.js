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
      Resource.get('1').send().then((resp) => {
        let newInstance = resp.models[0]
        expect(resp.models.length).toEqual(1)
        expect(newInstance.__status__).toEqual('loaded')
        expect(newInstance.id).toEqual(1)
        expect(newInstance.title).toEqual('resource1')
        expect(newInstance.constructor).toEqual(Resource)
        expect(newInstance.resourcePath).toEqual('resources/1')
        expect(resp.status).toEqual(200)
        done()
      })
    })
  })
  it('loadOneByAbsolutePath', function (done) {
    let c = new MockupClient()
    c.loadMetadata({'Resource': {url: 'resources'}}).then(resps => {
      const Resource = c.metadata.models.Resource
      Resource.get('/resources/1').send().then((resp) => {
        let newInstance = resp.models[0]
        expect(resp.models.length).toEqual(1)
        expect(newInstance.__status__).toEqual('loaded')
        expect(newInstance.id).toEqual(1)
        expect(newInstance.title).toEqual('resource1')
        expect(newInstance.constructor).toEqual(Resource)
        expect(newInstance.resourcePath).toEqual('resources/1')
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
        expect(newResponse.models.length).toEqual(1)
        let instance = newResponse.models[0]
        expect(instance.__status__).toEqual('loaded')
        expect(newResponse.status).toEqual(200)
        // GET
        Resource.get(instance.id).send().then(getResponse => {
          let newInstance = getResponse.models[0]
          expect(getResponse.models.length).toEqual(1)
          expect(newInstance.title).toEqual('CRUD')
          expect(newInstance.__status__).toEqual('loaded')
          newInstance.title = 'CRUD(Updated)'
          expect(newInstance.__status__).toEqual('dirty')
          newInstance.title = 'CRUD'
          expect(newInstance.__status__).toEqual('loaded')
          newInstance.title = 'CRUD(Updated)'
          expect(newInstance.__status__).toEqual('dirty')
          expect(getResponse.status).toEqual(200)
          // PUT
          newInstance.save().send().then(saveResponse => {
            expect(newInstance).toEqual(saveResponse.models[0])
            expect(newInstance.__status__).toEqual('loaded')
            expect(newInstance.title).toEqual('CRUD(Updated)')
            expect(saveResponse.status).toEqual(200)

            // Reload (GET)
            newInstance.reload().send().then(reloadResponse => {
              expect(newInstance).toEqual(reloadResponse.models[0])
              expect(newInstance.__status__).toEqual('loaded')
              expect(reloadResponse.status).toEqual(200)
              // DELETE
              newInstance.delete().send().then(deleteResponse => {
                // expect(newInstance).toEqual(deleteResponse.models[0])
                expect(newInstance.__status__).toEqual('deleted')
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

