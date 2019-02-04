/**
 * Created by vahid on 7/9/17.
 */

import { MockupClient, fakeWindow } from './helpers'

describe('JsonPatch', function () {
  afterAll(function () {
    fakeWindow.location = new URL(window.location.href)
  })

  /* Testing json payload in both request & response */
  it('jsonpatch', function (done) {
    let c = new MockupClient()
    c.jsonPatchRequest('resources')
      .addRequest('', 'get')
      .addRequest('', 'get')
      .send()
      .then(resp => {
        expect(resp[0].status).toEqual(200)
        expect(resp[0].json.length).toEqual(10)
        expect(resp[1].json.length).toEqual(10)
        done()
      })
      .catch(done.fail)
  })

  it('jsonpatch 500', function (done) {
    let c = new MockupClient()
    c.jsonPatchRequest('internal_error')
      .addRequest('', 'get')
      .send()
      .then(done.fail)
      .catch(err => {
        expect(err[0].error === 'Internal server error')
        done()
      })
  })

  it('jsonpatch 401', function (done) {
    let c = new MockupClient()
    let request = c
      .jsonPatchRequest('resources')
      .addRequest('?status=401 unauthorized', 'get')

    expect(fakeWindow.location.href).toEqual(window.location.href)
    request
      .send()
      .then(done.fail)
      .catch(err => {
        expect(err[0].status).toEqual(401)
        let newLocation = new URL(fakeWindow.location.href)

        expect(newLocation.pathname).toEqual('/login')
        done()
      })
  })
})
