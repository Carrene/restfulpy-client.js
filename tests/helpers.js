/**
 * Created by vahid on 7/11/17.
 */

import { default as Client } from 'restfulpy'

export class MockupClient extends Client {
  constructor () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    super(window.__karma__.config.serverUrl)
  }
}
