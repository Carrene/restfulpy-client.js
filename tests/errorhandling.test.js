/**
 * Created by mehdi on 10/01/2018.
 */

import { MockupClient, fakeWindow } from './helpers'

describe('Error handling', function () {
  afterAll(function () {
    fakeWindow.location = new URL(window.location.href)
  })

  it('401', function (done) {
    let c = new MockupClient()
    let request = c
      .request('resources')
      .addQueryString('status', '401 unauthorized')

    expect(fakeWindow.location.href).toEqual(window.location.href)
    request
      .send()
      .then(done.fail)
      .catch(resp => {
        expect(resp.status).toEqual(401)
        let newLocation = new URL(fakeWindow.location.href)

        expect(newLocation.pathname).toEqual('/login')
        done()
      })
  })

  it('500', function (done) {
    let c = new MockupClient()
    c.request('internal_error')
      .send()
      .then(done.fail)
      .catch(err => {
        expect(true).toBeTruthy()
        expect(err.status).toEqual(500)
        expect(err.error).toEqual('Internal server error')
        expect(err.stackTrace).not.toBe(null)
        done()
      })
  })
})
