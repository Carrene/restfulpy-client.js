/**
 * Created by vahid on 7/9/17.
 */
import Client from 'restfulpy'
import fs from 'fs'

const MOCKUP_SERVER_ADDRESS_FILENAME = '/tmp/restfulpy-client-js-mockup-server-address'
const MOCKUP_SERVER_ADDRESS = fs.readFileSync('/tmp/restfulpy-client-js-mockup-server-address').toString()
console.log(MOCKUP_SERVER_ADDRESS, MOCKUP_SERVER_ADDRESS)

describe('client', function () {

  it('json echo', function () {

    let requestPayload = {item1: 'value1'}
    expect(requestPayload, {item1: 'value1'})
    let c = new Client()
    console.log(c)


  })
})

