/**
 * Created by vahid on 7/9/17.
 */

import { MockupClient } from './helpers'

// const MOCKUP_SERVER_ADDRESS = ''
describe('client', function () {

  it('json echo', function () {
    let requestPayload = {item1: 'value1'}
    expect(requestPayload, {item1: 'value1'})
    let c = new MockupClient()
    console.log(c)
  })
})

