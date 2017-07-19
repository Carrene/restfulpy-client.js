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

export default function createModelClass (name, fields) {
  let Model = function (data) {
    this.dirty = false
    this.data = data
    return new Proxy(this, instanceHandler)
  }

  Reflect.defineProperty(Model, 'name', {value: name})
  // Model.name = name
  Model.fields = {}
  for (let k in fields) {
    Model.fields[k] = new Field(fields[k])
  }
  return Model
}
