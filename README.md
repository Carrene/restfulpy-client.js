restfulpy-client.js
===================

Javascript client for [restfulpy](https://github.com/pylover/restfulpy)


## Install

```bash
npm install restfulpy
``


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


