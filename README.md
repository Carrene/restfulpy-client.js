# restfulpy-client.js
Javascript client for restfulpy


## Setup

```bash
npm install
```

```bash
v.activate
mkvirtualenv --python=$(which python3) restfulpy-client.js
pip install restfulpy
echo "export CHROME_BIN=$(which chromium-browser)" >> $VIRTUAL_ENV/bin/postactivate
# OR
echo "export CHROME_BIN=$(which chromium-browser)" >> ~/.bashrc
```

## Running tests

```bash
npm run test
```

## Running tests, and watch for changes (development mode)

```bash
npm run dev
```


## Build

```bash
npm run build
```


