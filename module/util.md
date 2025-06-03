# `utils` module

**The `util` Module in Node.js: A Collection of Utilities**

The `util` module provides a collection of utility functions that are useful for various tasks in Node.js development. 
While some of its functions have been superseded by newer language features or other modules, it still contains valuable
tools. Here's a note with examples:

* **Purpose:** The `util` module offers a variety of functions to assist with debugging, type checking, formatting 
  output, and other common programming tasks.
* **Importing:** To use the `util` module, you must import it using `require`:
    ```javascript
    const util = require('module/util');
    ```
* **Key Functions (with examples):**
    1. **`util.format(format, ...args)`:** Formats a string according to the `format` string, similar to `printf` in C.
       Very useful for creating formatted messages, especially for debugging.
        ```javascript
        const util = require('module/util');

        const name = 'Alice';
        const age = 30;

        const formattedString = util.format('Hello, %s! You are %d years old.', name, age);
        console.log(formattedString); // Output: Hello, Alice! You are 30 years old.
        ```
    2. **`util.inspect(object[, options])`**: Returns a string representation of an object, useful for debugging.
       Provides detailed information about the object's properties and methods.
        ```javascript
        const util = require('module/util');

        const myObject = {
          name: 'Bob',
          address: {
            street: '123 Main St',
            city: 'Anytown'
          }
        };

        const inspectedObject = util.inspect(myObject, { depth: null, colors: true });
        console.log(inspectedObject); // Output: A detailed, colored representation of myObject.
        ```
       Important `options` of util.inspect:
        * `depth`: Number of times to recurse while formatting the object. This is useful for inspecting deeply nested 
          objects. To recurse until the maximum depth, specify `null`. Defaults to 2.
        * `colors`: If true, the output is styled with ANSI color codes. Defaults to false.
        * `maxArrayLength`: Specifies the maximum number of `Array`, `TypedArray`, `WeakMap`, and `WeakSet` elements to 
          include when formatting. Set to `null` or `Infinity` to show all elements. Defaults to 100.
    3. **`util.types.is<Type>(value)`**: Functions for checking the type of a value. (e.g., `util.types.isNumber(value)`,
      `util.types.isString(value)`, `util.types.isDate(value)`).
        ```javascript
        const util = require('module/util');

        console.log(util.types.isNumber(123)); // Output: true
        console.log(util.types.isString('abc')); // Output: true
        console.log(util.types.isArray([1, 2, 3])); //Output: true
        ```
    4. **`util.inherits(constructor, superConstructor)`:** Allows a constructor to inherit prototype methods from
       another constructor. This is an older way of achieving inheritance in JavaScript, predating ES6 classes.
       Generally, prefer using the `class` syntax with `extends` for inheritance.
        ```javascript
        const util = require('module/util');

        function Animal(name) {
          this.name = name;
        }

        Animal.prototype.speak = function() {
          console.log('Generic animal sound');
        };

        function Dog(name) {
          Animal.call(this, name); // Call the super constructor
        }

        util.inherits(Dog, Animal); // Dog inherits from Animal

        Dog.prototype.speak = function() {
          console.log('Woof!');
        };

        const myDog = new Dog('Buddy');
        myDog.speak(); // Output: Woof!
        ```
    5. **`util.callbackify(async function)`:** (Relatively advanced) Transforms an asynchronous function (using 
      `async/await`) into a traditional callback-style function.  This is often used when interacting with older Node.js 
      APIs that still expect callbacks.

**Other Important Node.js Modules (Brief Recap):**

* **OS Module (`require('os')`):** Provides operating system-related utility methods, like getting the CPU architecture,
  available memory, hostname, etc.
    ```javascript
    const os = require('os');
    console.log('Platform:', os.platform()); // Example: 'darwin' (macOS) or 'win32' (Windows)
    ```
* **Path Module (`require('path')`):**  Provides utilities for working with file and directory paths.  Essential for
  manipulating file paths in a platform-independent way.
    ```javascript
    const path = require('path');
    const filePath = '/users/me/documents/myFile.txt';
    console.log('Base name:', path.basename(filePath)); // Output: myFile.txt
    ```
* **DNS Module (`require('dns')`):**  Enables performing DNS lookups (resolving domain names to IP addresses).
    ```javascript
    const dns = require('dns');

    dns.resolve4('google.com', (err, addresses) => {
      if (err) throw err;
      console.log('Addresses:', addresses); // Output: An array of IPv4 addresses
    });
    ```
* **Net Module (`require('net')`):**  Provides an API for creating TCP servers and clients.  Used for building network
  applications.
    ```javascript
    const net = require('net');

    const server = net.createServer((socket) => {
      console.log('Client connected');
      socket.on('data', (data) => {
        console.log('Received:', data.toString());
        socket.write('Server received: ' + data.toString());
      });
      socket.on('end', () => {
        console.log('Client disconnected');
      });
    });

    server.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
    ```
**In Summary:**

The `util` module offers helpful utility functions, particularly for debugging and formatting. The other modules you 
mentioned (OS, Path, DNS, Net) provide fundamental functionality for interacting with the operating system, file paths,
DNS resolution, and networking, respectively. Each module serves a specific purpose in building robust Node.js 
applications.
