# Node.js Event Loop JavaScript Code Execution Flow

## Overview of the Node.js Event Loop

The Node.js event loop is a fundamental concept that allows the execution of asynchronous callbacks. This is crucial to
Node.js’s non-blocking I/O and concurrency model. The event loop enables Node.js to perform I/O operations, such as
network requests, file system access, or timers, without blocking the main thread. The event loop continuously checks 
for pending tasks and executes the appropriate callbacks.

### Phases of the Event Loop

The event loop is divided into several phases, each responsible for handling specific types of tasks. The diagram 
provided shows the general flow of the event loop and how it manages asynchronous tasks.

### Detailed Flow

1. **Process and execute code in index.js file**
    - The event loop starts by executing the code in the index.js file (or any other entry point).
    - This is typically where you write your application logic, including any asynchronous functions like `setTimeout`, 
      `setInterval`, or I/O operations.

2. **Check for pending work (Timers, OS Tasks, Threadpool)**
    - After the code is executed, the event loop checks whether there are still tasks to process. These tasks could 
      include:
        - **Timers**: Registered through `setTimeout` or `setInterval`.
        - **OS Tasks**: Tasks such as server listening or incoming network connections.
        - **Threadpool Tasks**: File system operations or cryptographic operations handled by the thread pool.

3. **Run setTimeout's, setInterval's**
    - If there are any timers (such as `setTimeout` or `setInterval`) that are due, their callbacks are executed in this
      phase.

4. **Run callbacks for any OS tasks or threadpool tasks**
    - This is where most of the I/O or computational callbacks are processed. For instance:
        - File I/O operations (reading or writing to disk).
        - Incoming network requests.
        - Database queries.
    - This phase processes the majority of asynchronous tasks that are queued.

5. **Pause and wait for tasks to complete**
    - After processing the tasks, the event loop may enter a waiting state, where it pauses and waits for new events to 
      occur (like I/O events or timers).

6. **Run 'setImmediate' functions**
    - If there are any `setImmediate()` callbacks scheduled, they are executed in this phase. The `setImmediate`
      function is used to execute a callback immediately after I/O events are processed.

7. **Handle close events**
    - In this phase, the event loop handles any close events. For example, when a server or socket closes, this phase 
      ensures the cleanup of resources.

8. **Repeat**
    - The event loop repeats this cycle continuously, processing new tasks as they are added to the queue.

9. **Exit the program**
    - The event loop will exit when there are no more tasks to process (timers, OS tasks, threadpool tasks). At this
      point, the program terminates.

### Key Points

- **Non-blocking I/O**: The event loop is what enables Node.js to perform non-blocking I/O operations, which makes
  Node.js highly efficient for I/O-heavy tasks.
- **Phases**: Each phase of the event loop has a specific role, and the callbacks are processed accordingly.
- **setTimeout vs setImmediate**: `setTimeout` schedules tasks to be run after a specified delay, while `setImmediate` 
  schedules tasks to run immediately after I/O callbacks.

This model allows Node.js to handle multiple operations concurrently, without needing to create additional threads for
each task.

### Diagram of Execution Flow

The diagram below shows the flow of the event loop and the sequence in which tasks are processed:

![Node.js Event Loop](./images/javascript_code_execution_flow_in_nodejs.png)

[Source](https://www.udemy.com/course/advanced-node-for-developers/) <br/>

Understanding the event loop is crucial to writing efficient asynchronous code in Node.js.

# Task Execution Order
```js
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest () {
    https.request('https://www.google.com', res => {
        res.on('data', () => {});
        res.on('end', () => {
            console.log('HTTP Request:', Date.now() - start);
        });
    }).end();
}

function doHash() {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('Hash:', Date.now() - start);
    });
}

doRequest();

fs.readFile('test2.js', 'utf8', () => {
    console.log('FS:', Date.now() - start);
})

doHash();
doHash();
doHash();
doHash();
```
Output while run the node code with `node test2.js` command:
```
HTTP Request: 778
Hash: 1058
FS: 1059
Hash: 1074
Hash: 1084
Hash: 1152
```

But if we comment the hashing functions, 
```js
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest () {
    https.request('https://www.google.com', res => {
        res.on('data', () => {});
        res.on('end', () => {
            console.log('HTTP Request:', Date.now() - start);
        });
    }).end();
}

function doHash() {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('Hash:', Date.now() - start);
    });
}

doRequest();

fs.readFile('test2.js', 'utf8', () => {
    console.log('FS:', Date.now() - start);
})

// doHash();
// doHash();
// doHash();
// doHash();
```
The output for `node test2.js` command:
```
FS: 56
HTTP Request: 486
```

This is because the hashing functions are CPU-intensive and block the event loop, causing the file system read operation
and HTTP request to be delayed. When the hashing functions are commented out, the file system read operation and HTTP
request are executed first, resulting in a faster completion time.

```js
process.env.UV_THREADPOOL_SIZE = 1;

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest () {
    https.request('https://www.google.com', res => {
        res.on('data', () => {});
        res.on('end', () => {
            console.log('HTTP Request:', Date.now() - start);
        });
    }).end();
}

function doHash() {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('Hash:', Date.now() - start);
    });
}

doRequest();

fs.readFile('test2.js', 'utf8', () => {
    console.log('FS:', Date.now() - start);
})

doHash();
doHash();
doHash();
doHash();
```