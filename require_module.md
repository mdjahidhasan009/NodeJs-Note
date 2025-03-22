# `require` module
`require` is a function that is used to load modules in Node.js.

### Syntax
```javascript
require('module_name')
```

## Steps to use `require` module
### Resolving and Loading
It is the first step where the module is resolved. The module is searched in the following locations:
- Core modules
- File modules if path is provided like `./module_name`
  - If no file in there then it will search for `index.js` file in the directory.
- Node_modules

NOTE: If still not found then it will throw an error.

Then it loads the module in the memory.

If we add file like `my_module.js` inside `node_modules` directory then we can import it like `require('my_module')`.

### Wrapping
The code of the module or code inside the wrapper function run by the Node.js runtime.

### Evaluating
After wrapping, the module is evaluated and executed. The module is executed in the local scope.

### Returning Exports
`require` function return the `module.exports` object which is used to export the module in the file which is required.

### Caching
Node.js caches the module after loading it for the first time. If the same module is required again then it will return
the cached module.

## Example
**test.js**
```js
require('./test2');
require('./test2');
require('./test2');
require('./test2');
```
**test2.js**
```js
console.log('from test2.js');
```

Output:
```shell
$ node test.js
from test2.js
```
In the above example, `test2.js` is required 4 times, but it is executed only once because of caching.



**`require.resolve` method**
`require.resolve` method is used to resolve the module path. It returns the absolute path of the module.

Syntax:
```shell
$ node
Welcome to Node.js v20.15.1.
Type ".help" for more information.
> require.resolve('module_name')
Uncaught Error: Cannot find module 'module_name'
Require stack:
- <repl>
    at Module._resolveFilename (node:internal/modules/cjs/loader:1145:15)
    at Function.resolve (node:internal/modules/helpers:190:19) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '<repl>' ]
}
> require.resolve('fs')
'fs'
>
```

## Circular Dependency
In Node.js, circular dependency is a situation where two or more modules depend on each other. It is not recommended to
use circular dependency because it makes the code difficult to understand and maintain. But Node.js handles circular
dependency by caching the module after loading it for the first time and does not throw an error.

**test.js**
```js
const test2 = require('./test2');

console.log('from test.js');

console.log('module.loaded from top level code:', module.loaded);
setImmediate(() => {
    console.log('module.loaded from setImmediate:', module.loaded);
});

```

**test2.js**
```js
const test = require('./test');
console.log('from test2.js');
```

Output:
```shell
$ node test.js
from test2.js
from test.js
module.loaded from top level code: false
module.loaded from setImmediate: true
```

Node.Js manages circular dependency by caching the module after loading it for the first time. 

In the previous file first `test.js` is it required `test2.js` and then `test2.js` is required `test.js`. But as `test.js`
is already loaded and cached so it will not load it again. It will return the cached module. That's why module has 
`module.loaded` as `false` in the top-level code and `true` in the `setImmediate` function. 

Modules are get fully loaded after the top-level code is executed and event loop is started. So in the `setImmediate` 
function module is fully loaded and it has `module.loaded` as `true`.

That's why if we put `module.exports` inside of the callback function then it will not be available in the top-level 
code of the file which is requiring it. <br/><br/>

In this example we are getting `undefined` in the `data` variable in the `test.js` file.

test.js
```js
const data = require('./test2').data;

console.log('from test.js');

console.log('module.loaded from top level code:', module.loaded);
setImmediate(() => {
    console.log('module.loaded from setImmediate:', module.loaded);
});

console.log('data from test2.js:', data);
```

test2.js
```js
let fs = require('fs');

fs.readFile('./test.js', (err, data) => {
   module.exports.data = 10;
});
```

Output:
```shell
$ node test.js
from test.js
module.loaded from top level code: false
data from test2.js: undefined
module.loaded from setImmediate: true
```


Node.Js also can require JSON files. If we require JSON file then it will return the parsed JSON object.

example.json
```json
{
  "data": 10
}
```
test.js
```js
const data = require('./example');

console.log(data); // { data: 10 }
```
Output
```shell
$ node test.js
{ data: 10 }
```