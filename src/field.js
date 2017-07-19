/**
 * Created by vahid on 7/20/17.
 */

export default class Field {
  constructor (attributes) {
    for (let k in attributes) {
      this[k] = attributes[k]
    }
  }
}
