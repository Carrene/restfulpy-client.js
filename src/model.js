/**
 * Created by vahid on 7/15/17.
 */

export default class ModelDescriptor {
  /* This is a proxy for a specific model.
   */

  constructor (metadata) {
    this.fields = metadata
  }

  construct (target, argumentsList, newTarget) {
    let data = argumentsList[0]
    return new Proxy(data, this)
  }

  get (target, name) {
    return target[name]
  }

  set (target, name, value) {
    target[name] = value
  }
}
