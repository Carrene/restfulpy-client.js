/**
 * Created by vahid on 7/9/17.
 */
import { Client } from 'restfulpy'

describe('client', function () {

  it('json echo', function () {
    let requestPayload = {item1: 'value1'}
    expect(requestPayload, {item1: 'value1'})
    let c = new Client()
    console.log(c)

  })
})

