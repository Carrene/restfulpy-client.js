/**
 * Created by vahid on 7/14/17.
 */

import { MockupClient } from './helpers'

describe('Metadata', function () {
  it('Loading metadata', function (done) {
    let c = new MockupClient()
    c.loadMetadata({'Resource': 'resources'}).then((resps) => {
      expect(c.metadata.info.Resource.title).toEqual({
        message: 'Invalid Value',
        label: 'Title',
        watermark: 'title here',
        type_: 'str',
        default: '',
        pattern: '[a-zA-Z0-9]{3,}',
        maxLength: 30,
        minLength: 3,
        icon: 'default',
        name: 'title',
        optional: false,
        example: null,
        key: 'title'
      })
      done()
    }).catch(err => {
      console.log(err)
      done()
    })
  })
})

