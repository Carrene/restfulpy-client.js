/**
 * Created by armin on 3/13/18.
 */

import { MockupClient } from './helpers'

describe('WithCredentials', function () {
  it('With Credentials', function (done) {
    let c = new MockupClient()
    let request = c.request('resources')
    expect(request.xhrWithCredentials).toBeTruthy()
    request.withoutCredentials()
    expect(request.xhrWithCredentials).toBeFalsy()
    request.withCredentials()
    expect(request.xhrWithCredentials).toBeTruthy()
    done()
  })
})
