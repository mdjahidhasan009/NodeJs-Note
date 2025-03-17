# NPM(Node Package Manager)
NPM manages all packages and modules for Node.js
* Provides online repositories for node.js packages/modules
* Provides command line utility to install Node.js packages

### module exports
A module is a file or directory that is imported into another file. The `module.exports` object is used to export 
functions, objects, or primitive values from a given file or module. It encapsulates the module's code and data into a
single unit of code.

```javascript
// math.js
const sum = (a, b) => a + b; // function to be exported
module.exports = sum; // export the function

// index.js
const sum = require('./math.js'); // import the function
console.log(sum(1, 2)); // 3
```



