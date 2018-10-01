/**
 * Created by mehdi on 10/01/2018.
 */

import { MockupClient, fakeWindow } from './helpers'

describe('Error handling', function () {
  it('401', function (done) {
    let c = new MockupClient()
    let request = c.request('resources')
      .addQueryString('status', '401 unauthorized')
    expect(fakeWindow.location.href).toEqual(window.location.href)
    request.send().catch(resp => {
      expect(resp.status).toEqual(401)
      let newLocation = new URL(fakeWindow.location.href)
      expect(newLocation.pathname).toEqual('/login')
      debugger
    })
    done()
  })
})
