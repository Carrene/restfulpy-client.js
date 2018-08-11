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
    if (name in target.constructor.fields) {
      return this[name] || target.constructor.fields[name].default
    }
    return undefined
  },

  set (target, name, value) {
    if (name in target.constructor.fields) {
      if (target.__status__ === 'deleted') {
        throw new ModelStateError('Cannot change deleted object.')
      }
      target[name] = value
      target.changed()
    } else {
      target[name] = value
    }
    return true
  },

  ownKeys: function (target) {
    return Object.keys(target).concat(Object.keys(target.constructor.fields))
  },

  has: function (target, key) {
    return key in target || key in target.constructor.fields
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
    return `${this.constructor.__url__}/${this.__identity__.join('/')}`
  },
  changed () {
    // // FIXME: This condition is for handling vuejs proxy
    if (this.__ob__) {
      this.__ob__.dep.notify()
    }
    this.__hash__ = getObjectHashCode(this.toJson())
    if (this.__status__ === 'new') {
      return
    }
    this.__status__ = (this.__server_hash__ === this.__hash__) ? 'loaded' : 'dirty'
  },
  delete () {
    switch (this.__status__) {
      case 'new':
        throw new ModelStateError('Cannot delete unsaved objects.')
      case 'deleted':
        throw new ModelStateError('Object is already deleted.')
    }
    return this.constructor.__client__
      .requestModel(this.constructor, this.resourcePath, this.constructor.__verbs__.delete)
      // This is the old method for deleting the model
      // .request(this.resourcePath, 'DELETE')
      // .setPostProcessor((resp, resolve) => {
      //   this.updateFromResponse(resp)
      //   this.__status__ = 'deleted'
      //   resolve(this, resp)
      // })
  },
  reload () {
    switch (this.__status__) {
      case 'new':
        throw new ModelStateError('Save object before reload.')
      case 'deleted':
        throw new ModelStateError('Object is deleted.')
    }
    return this.constructor.__client__
      .requestModel(this.constructor, this.resourcePath, this.constructor.__verbs__.get)
      // This is the old method for reloading the model
      // .request(this.resourcePath, 'GET')
      // .setPostProcessor((resp, resolve) => {
      //   this.updateFromResponse(resp)
      //   this.__status__ = 'loaded'
      //   resolve(this, resp)
      // })
  },
  save () {
    let verb
    let resourceUrl
    switch (this.__status__) {
      case 'loaded':
        throw new ModelStateError('Object is not changed.')
      case 'deleted':
        throw new ModelStateError('Object is deleted.')
      case 'new':
        // verb = 'POST'
        verb = this.constructor.__verbs__.create
        resourceUrl = this.constructor.__url__
        break
      default:
        // verb = 'PUT'
        verb = this.constructor.__verbs__.update
        resourceUrl = this.resourcePath
    }
    return this.constructor.__client__
      .requestModel(this.constructor, resourceUrl, verb)
      .addParameters(this.toJson())
      // This is the old method for saving the model
      // .request(resourceUrl, verb)
      // .setPostProcessor((resp, resolve) => {
      //   this.updateFromResponse(resp)
      //   this.__status__ = 'loaded'
      //   resolve(this, resp)
      // })
  },
  toJson () {
    let result = {}
    for (let fieldName in this.constructor.fields) {
      let value = this.encodeFieldValueToJson(this.constructor.fields[fieldName])
      if (value === undefined) {
        continue
      }
      result[fieldName] = value
    }
    return result
  },
  encodeFieldValueToJson (field) {
    return this[field.name]
  },
  update (obj) {
    for (let fieldName in obj) {
      if (fieldName in this.constructor.fields) {
        this[fieldName] = obj[fieldName]
      }
    }
  },
  updateFromResponse (resp) {
    this.updateFromJson(resp.json)
  },
  updateFromJson (json) {
    this.update(this.constructor.decodeJson(json))
  }
}

const DEFAULT_VERBS = {
  load: 'GET',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE'
}

export default function createModelClass (name, options, client, metadata) {
  let Model = function (values, status = 'new') {
    this.constructor = Model
    this.__status__ = status
    this.__hash__ = 0
    if (values) {
      this.update(values)
    }
    this.__server_hash__ = (status === 'loaded') ? getObjectHashCode(values) : 0
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
    return Model.__client__
      .requestModel(Model, Model.__url__, Model.__verbs__.load).filter(...filters)
  }
  Model.fromResponse = (resp) => {
    return new Model(Model.decodeJson(resp.json), 'loaded')
  }
  Model.decodeJson = (json) => {
    let result = {}
    for (let fieldName in metadata.fields) {
      if (fieldName in json) {
        result[fieldName] = Model.decodeFieldValueFromJson(metadata.fields[fieldName], json[fieldName])
      }
    }
    return result
  }
  Model.decodeFieldValueFromJson = (field, encodedValue) => {
    return encodedValue
  }
  Model.get = (...keys) => {
    let resourcePath = ''
    if (keys.join('').startsWith('/')) {
      resourcePath = keys.join('/').substr(1)
    } else {
      resourcePath = `${Model.__url__}/${keys.join('/')}`
    }
    return Model.__client__.requestModel(Model, resourcePath, 'GET').send()
  }
  return Model
}
