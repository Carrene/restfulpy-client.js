/**
 * Created by vahid on 7/15/17.
 */
import Field from './field'

const instanceHandler = {
  get (target, name) {
    if (name in target) {
      return target[name]
    }
    if (name in target.data) {
      return target.data[name]
    }
    return undefined
  },

  set (target, name, value) {
    if (name in target.constructor.fields) {
      if (target.data[name] !== value) {
        target.data[name] = value
        target.dirty = true
      }
      return
    }
    target[name] = value
  }
}

const DEFAULT_VERBS = {
  load: 'GET',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE'
}

export default function createModelClass (name, options, client, metadata) {
  let Model = function (data) {
    this.dirty = false
    this.data = data
    return new Proxy(this, instanceHandler)
  }
  // Defining a name for our class
  Reflect.defineProperty(Model, 'name', {value: name})
  // URL
  Model.__url__ = options.url
  // Creating a static member consist of of all fields
  Model.fields = {}
  for (let k in metadata.fields) {
    Model.fields[k] = new Field(metadata.fields[k])
  }
  // Storing some static variables
  Model.__client__ = client
  Model.primaryKeys = metadata.primaryKeys
  // Creating HTTP shorthands
  let verbs = Object.assign({}, DEFAULT_VERBS, options.verbs || {})
  Model.load = (...filters) => {
    return new Promise((resolve, reject) => {
      Model.__client__.request(Model.__url__, verbs.load).filter(...filters).done().then(resp => {
        resolve(resp.json.map(o => new Model(o)))
      }, resp => {
        // Error
        reject(resp)
      })
    })
  }
  // for (let verb in verbs) {
  //
  // }
  return Model
}
