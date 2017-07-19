/**
 * Created by vahid on 7/14/17.
 */

import { MockupClient } from './helpers'
import Field from '../src/field'

describe('Metadata', function () {
  it('Loading metadata', function (done) {
    let c = new MockupClient()
    c.loadMetadata({'Resource': {url: 'resources'}}).then((resps) => {
      expect(c.metadata.models.Resource.fields.title instanceof Field).toBeTruthy()
      done()
    })
  })
})

