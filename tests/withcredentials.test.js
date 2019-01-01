/**
 * Created by armin on 3/13/18.
 */

import { MockupClient } from './helpers'
import { InvalidOperationError } from '../src/exceptions'

describe('WithCredentials', function () {
  it('With Credentials', function (done) {
    let c = new MockupClient()
    let request = c.request('resources')

    expect(request.xhrWithCredentials).toBeTruthy()
    request.withoutCredentials()

    expect(request.xhrWithCredentials).toBeFalsy()
    expect(() => request.withoutCredentials()).toThrow(
      new InvalidOperationError()
    )
    request.withCredentials()

    expect(request.xhrWithCredentials).toBeTruthy()
    expect(() => request.withCredentials()).toThrow(new InvalidOperationError())
    done()
  })
})
