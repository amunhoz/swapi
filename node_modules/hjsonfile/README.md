Node.js - hjsonfile
================

Easily read/write HJSON files. Based on [jsonfile](https://www.npmjs.com/package/jsonfile).  

<a href="https://github.com/feross/standard"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100"></a>


Why?
----

Writing `JSON.stringify()` and then `fs.writeFile()` and `JSON.parse()` with `fs.readFile()` enclosed in `try/catch` blocks became annoying.



Installation
------------

    npm install --save hjsonfile



API
---

### readFile(filename, [options], callback)

`options` (`object`, default `undefined`): Pass in any `fs.readFile` options and to [hjson.parse](https://www.npmjs.com/package/hjson#hjsonparsetext-options).
  - `throws` (`boolean`, default: `true`). If `JSON.parse` throws an error, pass this error to the callback.
  If `false`, returns `null` for the object.


```js
var jsonfile = require('hjsonfile')
var file = '/tmp/data.json'
jsonfile.readFile(file, function(err, obj) {
  console.dir(obj)
})
```


### readFileSync(filename, [options])

`options` (`object`, default `undefined`): Pass in any `fs.readFileSync` options and to [hjson.parse](https://www.npmjs.com/package/hjson#hjsonparsetext-options).

- `throws` (`boolean`, default: `true`). If `JSON.parse` throws an error, throw the error.
If `false`, returns `null` for the object.

```js
var jsonfile = require('hjsonfile')
var file = '/tmp/data.json'

console.dir(jsonfile.readFileSync(file))
```


### writeFile(filename, obj, [options], callback)

`options`: Pass in any `fs.writeFile` options and to [hjson.stringify](https://www.npmjs.com/package/hjson#hjsonstringifyvalue-options).


```js
var jsonfile = require('hjsonfile')

var file = '/tmp/data.json'
var obj = {name: 'JP'}

jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
})
```

**formatting with space:**

```js
var jsonfile = require('hjsonfile')

var file = '/tmp/data.json'
var obj = {name: 'JP'}

jsonfile.writeFile(file, obj, {space: 2}, function(err) {
  console.error(err)
})
```

**appending to an existing JSON file:**

You can use `fs.writeFile` option `{flag: 'a'}` to achieve this.

```js
var jsonfile = require('hjsonfile')

var file = '/tmp/mayAlreadyExistedData.json'
var obj = {name: 'JP'}

jsonfile.writeFile(file, obj, {flag: 'a'}, function (err) {
  console.error(err)
})
```

### writeFileSync(filename, obj, [options])

`options`: Pass in any `fs.writeFileSync` options and to [hjson.stringify](https://www.npmjs.com/package/hjson#hjsonstringifyvalue-options).

```js
var jsonfile = require('hjsonfile')

var file = '/tmp/data.json'
var obj = {name: 'JP'}

jsonfile.writeFileSync(file, obj)
```

**formatting with space:**

```js
var jsonfile = require('hjsonfile')

var file = '/tmp/data.json'
var obj = {name: 'JP'}

jsonfile.writeFileSync(file, obj, {space: 2})
```

**appending to an existing JSON file:**

You can use `fs.writeFileSync` option `{flag: 'a'}` to achieve this.

```js
var jsonfile = require('hjsonfile')

var file = '/tmp/mayAlreadyExistedData.json'
var obj = {name: 'JP'}

jsonfile.writeFileSync(file, obj, {flag: 'a'})
```

### space

Global configuration to set space to indent JSON files.

**default:** `null`

```js
var jsonfile = require('hjsonfile')

jsonfile.space = 4

var file = '/tmp/data.json'
var obj = {name: 'JP'}

// json file has four space indenting now
jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
})
```

Note, it's bound to `this.space`. So, if you do this:

```js
var myObj = {}
myObj.writeJsonSync = jsonfile.writeFileSync
// => this.space = null
```

Could do the following:

```js
var jsonfile = require('hjsonfile')
jsonfile.space = 4
jsonfile.writeFileSync(file, obj) // will have 4 spaces indentation

var myCrazyObj = {space: 32}
myCrazyObj.writeJsonSync = jsonfile.writeFileSync
myCrazyObj.writeJsonSync(file, obj) // will have 32 space indentation
myCrazyObj.writeJsonSync(file, obj, {space: 2}) // will have only 2
```

