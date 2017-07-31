restfulpy-client.js
===================

Javascript client for [restfulpy](https://github.com/pylover/restfulpy)


Install
-------

```bash
npm install restfulpy
```

Usage
-----

```javascript
import Client from 'restfulpy'

let client = new Client('http://example.org/api/v1')

// Login
client.login({'email': 'user1@example.com', 'password': '123456'}).then(resp => {
  // Authentication success, so
  console.log(resp.json.token) // is not null
  console.log(client.authenticator.authenticated) // is true
}).catch(resp => {
  throw resp.error
})


// Posting some data to `http://example.org/api/v1/echo`
client.request('echo', 'POST').addParameters({item1: "Value1"}).send().then(resp => {
  console.log(resp.status) // Is 200
  console.log(resp.json)
  console.log(resp.getHeader('Content-Type'))
}).catch(resp => {
  console.log(resp.status)
  throw resp.error
})

// Logout
client.logout()
```

## Metadata

```javascrypt

client.metadata.ModelName.get(1).done(model => {
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
export VIRTUALENVWRAPPER_PYTHON="$(which python3)"
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
mkvirtualenv --python=$(which python3) restfulpy
```

Installing the python dependencies

```bash
cd path/to/project
pip install -r requirements.txt
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
