/**
 * Created by vahid on 7/14/17.
 */

export default class Metadata {
  constructor (entities) {
    this.entities = entities
    this.info = {}
  }

  load (client) {
    let promises = []
    for (let entity in this.entities) {
      promises.push(new Promise((resolve, reject) => {
        client.request(this.entities[entity], 'METADATA').done().then(resp => {
          this.info[entity] = resp.json
          resolve(this.info[entity])
        }).catch(resp => {
          reject(resp)
        })
      }))
    }

    return Promise.all(promises)
  }
}
