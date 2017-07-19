/**
 * Created by vahid on 7/14/17.
 */

import createModelClass from './model'

export default class Metadata {
  constructor () {
    this.models = {}
  }

  load (client, entities) {
    let promises = []
    for (let entity in entities) {
      promises.push(new Promise((resolve, reject) => {
        client.request(entities[entity], 'METADATA').done().then(resp => {
          let modelClass = this.models[entity] = createModelClass(entity, resp.json)
          resolve(modelClass)
        }).catch(resp => {
          reject(resp)
        })
      }))
    }
    return Promise.all(promises)
  }
}
