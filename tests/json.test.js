/**
 * Created by vahid on 7/9/17.
 */
import Client from 'restfulpy'

// const MOCKUP_SERVER_ADDRESS = ''
describe('client', function () {

  it('json echo', function () {
    console.log(__karma__.config.args)
    let requestPayload = {item1: 'value1'}
    expect(requestPayload, {item1: 'value1'})
    let c = new Client()
    console.log(c)
  })
})

