/**
 * Created by vahid on 7/15/17.
 */
import Field from './field'
import { getObjectHashCode } from './helpers'

class ModelStateError extends Error {}

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
      if (target.__status__ === 'deleted') {
        throw new ModelStateError('Cannot change deleted object.')
      }
      target.data[name] = value
      target.changed()
    } else {
      target[name] = value
    }
    return true
  }
}

const modelPrototype = {
  /*
   * +----------------+----------------+--------+--------+---------+
   * | state / ACTION | CHANGE         | SAVE   | RELOAD | DELETE  |
   * +----------------+----------------+--------+--------+---------+
   * | new            | new            | loaded | error  | error   |
   * +----------------+----------------+--------+--------+---------+
   * | loaded         | dirty          | error  | loaded | deleted |
   * +----------------+----------------+--------+--------+---------+
   * | dirty          | dirty / loaded | loaded | loaded | deleted |
   * +----------------+----------------+--------+--------+---------+
   * | deleted        | error          | error  | error  | error   |
   * +----------------+----------------+--------+--------+---------+
   */
  get __identity__ () {
    return this.constructor.__primaryKeys__.map(k => this[k])
  },
  get resourcePath () {
    return `${this.__url__}/${this.__identity__.join('/')}`
  },
  changed () {
    this.__hash__ = getObjectHashCode(this.data)
    if (this.__status__ === 'new') {
      return
    }
    this.__status__ = (this.__server_hash__ === this.__hash__) ? 'loaded' : 'dirty'
  },
  update (obj) {
    Object.assign(this.data, obj)
  },
  delete () {
    switch (this.__status__) {
      case 'new':
        throw new ModelStateError('Cannot delete unsaved objects.')
      case 'deleted':
        throw new ModelStateError('Object is already deleted.')
    }
    return new Promise((resolve, reject) => {
      this.constructor.__client__.request(this.resourcePath, 'DELETE').done().then(resp => {
        this.update(resp.json)
        this.__status__ = 'deleted'
        resolve(this)
      }, resp => {
        // Error
        reject(resp)
      })
    })
  },
  reload () {
    switch (this.__status__) {
      case 'new':
        throw new ModelStateError('Save object before reload.')
      case 'deleted':
        throw new ModelStateError('Object is deleted.')
    }
    return new Promise((resolve, reject) => {
      this.constructor.__client__.request(this.resourcePath, 'GET').done().then(resp => {
        this.update(resp.json)
        this.__status__ = 'loaded'
        resolve(this)
      }, resp => {
        // Error
        reject(resp)
      })
    })
  },
  save () {
    switch (this.__status__) {
      case 'loaded':
        throw new ModelStateError('Object is not changed.')
      case 'deleted':
        throw new ModelStateError('Object is deleted.')
    }
    return new Promise((resolve, reject) => {
      this.constructor.__client__.request(this.constructor.__url__, (this.__status__ === 'new') ? 'POST' : 'PUT')
        .addParameters(this.data)
        .done().then(resp => {
          this.update(resp.json)
          this.__status__ = 'loaded'
          resolve(this)
        }, resp => {
          // Error
          reject(resp)
        })
    })
  }
}

const DEFAULT_VERBS = {
  load: 'GET',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE'
}

export default function createModelClass (name, options, client, metadata) {
  let Model = function (data, status = 'new') {
    this.__status__ = status
    this.__hash__ = 0
    this.constructor = Model
    this.__server_hash__ = (status === 'loaded') ? getObjectHashCode(data) : 0
    this.data = data
    this.changed()
    return new Proxy(this, instanceHandler)
  }
  Model.prototype = modelPrototype

  // Defining a name for our class
  Reflect.defineProperty(Model, 'name', {value: name})
  // Storing some static variables
  // Creating a static member consist of of all fields
  Model.fields = {}
  for (let k in metadata.fields) {
    Model.fields[k] = new Field(metadata.fields[k])
  }
  Model.__client__ = client
  Model.__url__ = options.url
  Model.__primaryKeys__ = metadata.primaryKeys
  // Creating HTTP shorthands
  Model.__verbs__ = Object.assign({}, DEFAULT_VERBS, options.verbs || {})
  Model.load = (...filters) => {
    return new Promise((resolve, reject) => {
      Model.__client__.request(Model.__url__, Model.__verbs__.load).filter(...filters).done().then(resp => {
        resolve(resp.json.map(o => new Model(o, 'loaded')))
      }, resp => {
        // Error
        reject(resp)
      })
    })
  }
  Model.get = (...keys) => {
    return new Promise((resolve, reject) => {
      Model.__client__.request(`${Model.__url__}/${keys.join('/')}`, 'GET').done().then(resp => {
        resolve(new Model(resp.json, 'loaded'))
      }, resp => {
        // Error
        reject(resp)
      })
    })
  }
  return Model
}
