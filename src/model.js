/**
 * Created by vahid on 7/15/17.
 */

class InstanceProxyHandler {

  constructor (typeProxy) {
    this.typeProxy = typeProxy
  }

  get (target, name) {
    if (name === 'constructor') {
      return this.typeProxy
    }
    return target[name]
  }
}

const typeProxyHandler = {

  construct (target, argumentsList, newTarget) {
    let data = argumentsList[0]
    return new Proxy(data, new InstanceProxyHandler(newTarget))
  }

}

export default function createModel (fields) {
  return new Proxy(fields, typeProxyHandler)
}
