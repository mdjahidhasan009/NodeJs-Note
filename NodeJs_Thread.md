# NodeJs Thread
When we run Node.js application it automatically create a thread for us(main thread). Node.js is a single-threaded 
language which in background uses multiple threads to execute asynchronous code. Node.js is non-blocking which means
that all functions( callbacks ) are delegated to the event loop, and they are ( or can be ) executed by different 
threads. That is handled by Node.js run-time.

# Event Loop in Node.js
Event loop handles all async operations in Node.js. It is a single thread that performs all I/O operations asynchronously.
Operations are added to a queue and are processed in the event loop. Event loop uses the call stack and callback queue to
schedule the execution of the operations. It processes in the main thread and offloads the async operations to the 
other threads. When other threads finish their work, they return the result to the event loop which is running in main
thread. Event loop then adds the callback to the callback queue and the callback is executed in the main thread.


# Node.js Event Loop With Code Explanation

```js
// node test.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// New timers, tasks, operations are recorded from myFile running
myFile.runContents();

function shouldContinue() {
    // check one: any pending setTimeout, setInterval, setImmediate?
    // check two: any pending OS tasks? (like server listening to port)
    // check three: any pending long-running operations? (like fs module)

    return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// entire body executes in one go
while (shouldContinue()) {
    // 1) Node looks at pendingTimers and sees if any functions are ready to be called like setTimeout, setInterval
    // 2) Node looks at pendingOSTasks and pendingOperations and calls relevant callbacks
    // 3) Pause execution. Continue when...
    // - a new pendingOSTask is done
    // - a new pendingOperation is done
    // - a timer is about to complete
    // 4) Look at pendingTimers. Call any setImmediate
    // 5) Handle any 'close' events, like closing a file or a server connection mostly cleanup tasks
}

// exit back to terminal
```
Here's a breakdown of the code and its components:

## 1. **Initialization**

```js
const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];
```

- These three arrays are placeholders that simulate various types of asynchronous tasks that Node.js handles.
- **pendingTimers**: This would represent tasks scheduled by `setTimeout()`, `setInterval()`, or `setImmediate()`.
- **pendingOSTasks**: This represents tasks that involve interactions with the operating system, such as a server listening on a port or file system operations.
- **pendingOperations**: Represents long-running tasks, such as file system (fs) module tasks or database queries that are handled outside the main event loop.

## 2. **Run the file**

```js
myFile.runContents();
```
This represents running the contents of a hypothetical file. When this file is run, it may set timers, make OS requests
(like reading a file), or start other asynchronous operations.

## 3. **Function: `shouldContinue()`**

```js
function shouldContinue() {
    return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}
```
- **Purpose**: This function checks if the event loop should continue running.
- **Explanation**: It returns `true` if there are any pending timers, OS tasks, or long-running operations. If all of
  these are cleared, the event loop stops.

### Conditions Checked in `shouldContinue()`
- **Pending Timers**: Are there any `setTimeout` or `setInterval` functions waiting to be executed?
- **Pending OS Tasks**: Are there any tasks like a server listening on a port?
- **Pending Long-Running Operations**: Are there any asynchronous operations, such as file reads, still in progress?

## 4. **Main Event Loop**

```js
while (shouldContinue()) {
    // Loop steps here...
}
```
- This `while` loop simulates the Node.js event loop. It will continue running as long as `shouldContinue()` returns
  `true`.
- Within each iteration of the loop, several steps take place to check the status of timers, OS tasks, and other 
  asynchronous operations.

### Steps Inside the Loop

#### **Step 1: Check Pending Timers**
```js
// Node looks at pendingTimers and sees if any functions are ready to be called like setTimeout, setInterval
```
Node.js checks the `pendingTimers` array for any timers that have completed their waiting time (like `setTimeout` or 
`setInterval`).

#### **Step 2: Check OS Tasks and Operations**
```js
// Node looks at pendingOSTasks and pendingOperations and calls relevant callbacks
```
Node.js checks for any completed OS tasks (e.g., reading from the filesystem) or long-running operations and processes
their callbacks.

#### **Step 3: Pause Execution**
```js
// Node pauses and waits for more tasks or timers to complete
```
- Node.js may pause and wait for new tasks to complete or new tasks to be scheduled. It waits for:
    - OS tasks to finish.
    - Long-running operations to complete.
    - Timers to reach their scheduled execution time.

#### **Step 4: Check for `setImmediate`**
```js
// Look at pendingTimers. Call any setImmediate
```
Node.js checks if any `setImmediate()` timers are ready to be executed and processes them.

#### **Step 5: Handle 'close' Events**
```js
// Handle any 'close' events, like closing a file or a server connection mostly cleanup tasks
```
Node.js processes any 'close' events. This usually happens when resources like file streams or server connections are
closed.

## 5. **Event Loop Completes**
```js
// exit back to terminal
```
When all pending tasks, timers, and operations are complete, the `shouldContinue()` function returns `false`, causing 
the event loop to exit and return control back to the terminal.

## Summary:
- This code demonstrates how Node.js handles asynchronous tasks in the background using the event loop.
- Node.js is single-threaded, but asynchronous operations (like file reads, network requests, etc.) are offloaded to
  other threads or the system, and their callbacks are eventually handled by the event loop.

# Single Threaded vs Multi-Threaded in Node.js
Event loop in Node.js is single-threaded. It is responsible for handling asynchronous I/O operations and callbacks.

Some node frameworks like express or std lib like fs module are not single-threaded. They use libuv library which
provides a thread pool to handle file system operations, DNS lookups, and other operations that may block the event loop.
This allows Node.js to perform non-blocking I/O operations even though it is single-threaded.

## Single-Threaded
```js
const crypto = require('crypto');

const start = Date.now();
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('1:', Date.now() - start);
});
```
This code snippet demonstrates the use of the `crypto` module in Node.js to perform a CPU-intensive operation. The `pbkdf2`
function is used to hash a password using a key derivation function. The function takes several parameters, including the
password, salt, iterations, key length, and hash algorithm.

In this example, the `pbkdf2` function is called with the password `'a'`, salt `'b'`, 100,000 iterations, a key length of 512
bytes, and the SHA-512 hash algorithm. Once the hashing operation is complete, a callback function is executed, which logs
the time taken to complete the operation.

The `crypto.pbkdf2` function is a CPU-intensive operation that can be used to simulate heavy computational tasks in Node.js.
By measuring the time taken to complete the operation, you can evaluate the performance of your Node.js application when
handling such tasks.

Output:
```
node test.js
1: 726
```

## Multi-Threaded
```js
const crypto = require('crypto');

const start = Date.now();
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2:', Date.now() - start);
});
```

In this code snippet, two `crypto.pbkdf2` functions are called in parallel. Each function performs a CPU-intensive hashing
operation with the same parameters. The callbacks for each function log the time taken to complete the operation along with
a unique identifier (1 or 2).

When running this code, you will observe that both operations complete at approximately the same time, indicating
concurrent execution of the CPU-intensive tasks. This behavior is possible because the `crypto` module in Node.js uses a
thread pool to handle CPU-bound operations asynchronously, allowing multiple tasks to run concurrently.

Output:
```
node test.js
1: 829
2: 837
```

Suppose those two operations take 1 second each. If Node.js was single-threaded, the second operation would have to wait
for the first one to complete before starting. Then the total time would be 2 seconds. But because Node.js is 
multithreaded, both operations can run concurrently, reducing the total time to around 1 second. We can see above output
that both operations complete at approximately the same time. This demonstrates the benefits of using a multithreaded
approach for CPU-bound tasks in Node.js. Those two needs more time than single crypto operation because of the overhead 
of creating new threads.

