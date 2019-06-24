# restfulpy-client.js

Javascript client for [restfulpy](https://github.com/pylover/restfulpy)

[![NPM](https://img.shields.io/npm/v/restfulpy.svg)](https://www.npmjs.com/package/restfulpy)
![](https://img.shields.io/npm/dm/restfulpy.svg)
[![Build Status](https://travis-ci.org/Carrene/restfulpy-client.js.svg?branch=master&service=github)](https://travis-ci.org/Carrene/restfulpy-client.js)
[![Coverage Status](https://coveralls.io/repos/github/Carrene/restfulpy-client.js/badge.svg)](https://coveralls.io/github/Carrene/restfulpy-client.js)
![License](https://img.shields.io/github/license/Carrene/restfulpy-client.js.svg)

## Install

```bash
npm install restfulpy
sudo apt-get install redis-server
```

Create a postgres database named: `restfulpymockupserver`

## Usage

```javascript
import { BrowserSession, Authenticator, httpClient, Response } from 'restfulpy'

class LocalAuthenticator extends Authenticator {
  login(credentials) {
    // Add your login method for example:
    return httpClient(
      `http://example.org/api/v1/sessions`,
      {
        verb: 'POST',
        payload: this.constructor.validateCredentials(credentials)
      },
      (...args) => {
        return new Response(null, ...args)
      }
    )
      .then(resp => {
        this.token = resp.json.token
        return Promise.resolve(resp)
      })
      .catch(resp => {
        this.deleteToken()
        return Promise.reject(resp)
      })
  }
}

let authenticator = new LocalAuthenticator()

const errorHandler = {
  401: (status, redirectUrl) => {
    // Your handler for 401 error
    // You can add handler for each status code
  }
}

let client = new BrowserSession(
  'http://example.org/api/v1',
  undefined,
  authenticator,
  errorHandlers
)

// Login
client
  .login({ email: 'user1@example.com', password: '123456' })
  .then(resp => {
    // Authentication success, so
    console.log(resp.json.token) // is not null
    console.log(client.authenticator.authenticated) // is true
  })
  .catch(resp => {
    throw resp.error
  })

// Posting some data to `http://example.org/api/v1/echo`
client
  .request('echo', 'POST')
  .addParameters({ item1: 'Value1' })
  .send()
  .then(resp => {
    console.log(resp.status) // Is 200
    console.log(resp.json)
    console.log(resp.getHeader('Content-Type'))
  })
  .catch(resp => {
    console.log(resp.status)
    throw resp.error
  })

// Logout
client.logout()
```

## Metadata

```javascrypt

client.metadata.ModelName.get(1).done(models => {
  // Use model
})

client.metadata.ModelName.load().done(models => {
  // Use models
})

```

## Development Environment Setup

```bash
git clone <repo> && cd into/cloned/repo
npm install
sudo apt-get install redis-server

```

### Build

```bash
npm run build
```

### Running tests

An instance of the [restfulpy](https://github.com/pylover/restfulpy) is required as a mock-up server before running
tests, see the `mockup-server-karma.py` and `tests` directory to understand why you need to setup a python virtual env
to run tests.

Adding some stuff into the `~/.bashrc` file.

```bash
alias v.activate="source /usr/local/bin/virtualenvwrapper.sh"
export VIRTUALENVWRAPPER_PYTHON="$(which python3.6)"
```

Re-source the `~/.bashrc`

```bash
source ~/.bashrc
```

Sourcing the virtualenv wrapper.

```bash
v.activate
```

Creating a dedicated virtualenv for this project.

```bash
mkvirtualenv --python=$(which python3.6) restfulpy
```

Installing the python dependencies

```bash
pip install "restfulpy >= 1.1.2a1"
```

Finally! Running the tests.

```bash
npm run test
```

Or,

```bash
npm run test -- --no-single-run
```

To keep the browser open for more investigation and watch for changes. see karma documents for more info.

## Browser Support

| ![Firefox] | ![Chrome] | ![IE/Edge] | ![Safari] | ![Opera] |
| ---------- | --------- | ---------- | --------- | -------- |
| 17         | 41        | 12.0       | 9         | 28       |

[firefox]: https://cdnjs.cloudflare.com/ajax/libs/browser-logos/43.2.0/archive/firefox_1.5-3/firefox_1.5-3_32x32.png 'Firefox'
[chrome]: https://cdnjs.cloudflare.com/ajax/libs/browser-logos/43.2.0/chrome/chrome_32x32.png 'Chrome'
[ie/edge]: https://cdnjs.cloudflare.com/ajax/libs/browser-logos/43.2.0/edge/edge_32x32.png 'IE/Edge'
[safari]: https://cdnjs.cloudflare.com/ajax/libs/browser-logos/43.2.0/safari/safari_32x32.png 'Safari'
[opera]: https://cdnjs.cloudflare.com/ajax/libs/browser-logos/43.2.0/opera/opera_32x32.png 'Opera'
