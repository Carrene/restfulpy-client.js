/**
 * Created by vahid on 7/15/17.
 */

export default class Model {
  constructor (data) {
    this.dirty = false
    this.data = data
  }

  get name () { return this.data['firstName']}

  set name (v) {
    this.data['firstName'] = v
    this.dirty = True
  }

  put () {
    if (!this.dirty) {
      throw new Error('Object is not changed.')
    }
  }

}
