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

const DEFAULT_VERBS = {
  load: 'GET',
  get: 'GET',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE'
}

export default function createModelClass (name, options, client, metadata) {
  class Model {
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
    constructor (values, status = 'new') {
      this.__status__ = status
      this.__hash__ = 0
      for (let field of Object.keys(metadata.fields)) {
        this[field] = metadata.fields[field].default
      }
      if (values) {
        this.update(values)
      }
      this.__server_hash__ =
        status === 'loaded' || status === 'deleted'
          ? getObjectHashCode(this.toJson())
          : 0
      this.changed()
      return new Proxy(this, instanceHandler)
    }

    get __identity__ () {
      return this.constructor.__primaryKeys__.map(k => this[k])
    }

    get resourcePath () {
      return `${this.constructor.__url__}/${this.__identity__.join('/')}`
    }

    get createURL () {
      return this.constructor.__url__
    }

    get updateURL () {
      return this.resourcePath
    }

    get reloadURL () {
      return this.resourcePath
    }

    get deleteURL () {
      return this.resourcePath
    }

    changed () {
      // FIXME: This condition is for handling vuejs proxy
      if (this.__ob__) {
        this.__ob__.dep.notify()
      }
      this.__hash__ = getObjectHashCode(this.toJson())
      if (this.__status__ === 'new' || this.__status__ === 'deleted') {
        return
      }
      this.__status__ =
        this.__server_hash__ === this.__hash__ ? 'loaded' : 'dirty'
    }

    delete () {
      switch (this.__status__) {
        case 'new':
          throw new ModelStateError('Cannot delete unsaved objects.')
        case 'deleted':
          throw new ModelStateError('Object is already deleted.')
      }
      return this.constructor.__client__
        .requestModel(
          this.constructor,
          this.deleteURL,
          this.constructor.__verbs__.delete
        )
        .setPostProcessor((resp, resolve) => {
          this.updateFromResponse(resp)
          this.__status__ = 'deleted'
          resolve(resp)
        })
    }

    reload () {
      switch (this.__status__) {
        case 'new':
          throw new ModelStateError('Save object before reload.')
        case 'deleted':
          throw new ModelStateError('Object is deleted.')
      }
      return this.constructor.__client__
        .requestModel(
          this.constructor,
          this.reloadURL,
          this.constructor.__verbs__.get
        )
        .setPostProcessor((resp, resolve) => {
          this.updateFromResponse(resp)
          resolve(resp)
        })
    }

    save () {
      let verb
      let resourceUrl
      switch (this.__status__) {
        case 'loaded':
          throw new ModelStateError('Object is not changed.')
        case 'deleted':
          throw new ModelStateError('Object is deleted.')
        case 'new':
          verb = this.constructor.__verbs__.create
          resourceUrl = this.createURL
          break
        default:
          verb = this.constructor.__verbs__.update
          resourceUrl = this.updateURL
      }
      let data = this.prepareForSubmit(verb, resourceUrl, this.toJson(true))
      return this.constructor.__client__
        .requestModel(this.constructor, resourceUrl, verb)
        .addParameters(data)
        .setPostProcessor((resp, resolve) => {
          this.updateFromResponse(resp)
          resolve(resp)
        })
    }

    prepareForSubmit (verb, url, data) {
      return data
    }

    toJson (omitReadonly = false) {
      let result = {}
      for (let fieldName in this.constructor.fields) {
        let value = this.encodeFieldValueToJson(
          this.constructor.fields[fieldName]
        )
        if (
          value === undefined ||
          (omitReadonly && this.constructor.fields[fieldName].readonly)
        ) {
          continue
        }
        result[fieldName] = value
      }
      return result
    }

    encodeFieldValueToJson (field) {
      return this[field.name]
    }

    update (obj) {
      for (let fieldName in obj) {
        if (fieldName in this.constructor.fields) {
          this[fieldName] = obj[fieldName]
        }
      }
    }
    updateFromResponse (resp) {
      this.__hash__ = resp.models[0].__hash__
      this.__server_hash__ = resp.models[0].__server_hash__
      this.updateFromJson(resp.json)
    }

    updateFromJson (json) {
      this.update(this.constructor.decodeJson(json))
    }

    // Storing some static variables
    // Creating a static member consist of of all fields
    static get fields () {
      let fields = {}
      for (let k in metadata.fields) {
        fields[k] = new Field(metadata.fields[k])
      }
      return fields
    }
    static get __client__ () {
      return client
    }
    static get __url__ () {
      return options.url
    }
    static get __primaryKeys__ () {
      return metadata.primaryKeys
    }
    // Creating HTTP shorthands
    static get __verbs__ () {
      return Object.assign({}, DEFAULT_VERBS, options.verbs || {})
    }
    static load (filters, baseUrl) {
      return this.__client__
        .requestModel(this, baseUrl || this.__url__, this.__verbs__.load)
        .filter(filters)
    }
    static fromResponse (resp) {
      return new this(this.decodeJson(resp.json), 'loaded')
    }
    static decodeJson (json) {
      let result = {}
      for (let fieldName in metadata.fields) {
        if (fieldName in json) {
          result[fieldName] = this.decodeFieldValueFromJson(
            metadata.fields[fieldName],
            json[fieldName]
          )
        }
      }
      return result
    }
    static decodeFieldValueFromJson (field, encodedValue) {
      return encodedValue
    }
    static get (keys, baseUrl) {
      let resourcePath = `${baseUrl || this.__url__}/${keys}`
      return this.__client__.requestModel(
        this,
        resourcePath,
        this.__verbs__.get
      )
    }
  }

  // Defining a name for our class
  Reflect.defineProperty(Model, 'name', { value: name })
  return Model
}
