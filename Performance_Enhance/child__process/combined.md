# Node.js Child Processes: A Comprehensive Guide

## Introduction to Child Processes in Node.js

In Node.js, the child process module is used to run system commands in separate processes. It provides the ability to 
spawn child processes similar to popen(3), enabling you to execute external commands, delegate CPU-intensive tasks, and
scale your application to utilize multiple CPU cores.

```javascript
const child_process = require('child_process');

child_process.exec('ls -l', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});
```

## Ways to Create Child Processes in Node.js

The `child_process` module provides several methods to create child processes, each with specific use cases and behaviors:

1. `spawn()`: For running commands with streaming I/O
2. `fork()`: For creating new Node.js processes
3. `exec()`: For running commands with buffered output
4. `execFile()`: For running executable files directly
5. `execSync()`: For synchronous command execution

Let's explore each in detail:

## Comparing `fork()` vs. `spawn()`

Both `fork()` and `spawn()` are functions in the `child_process` module that create child processes, but they have important differences:

### 1. Purpose and Use Cases

* **`spawn()`**: Primarily used for executing **non-Node.js** executables or commands. It's a general-purpose way to run
  any system command as a separate process. You'd use `spawn()` to run things like `ls`, `git`, `python`, or any other 
  program available on the system.
* **`fork()`**: Specifically designed to create **new Node.js processes**. It spawns a new instance of the Node.js 
  runtime and executes a specified JavaScript file in that new instance. This is useful for creating worker processes to
  handle computationally intensive tasks or to isolate parts of your application.

### 2. Process Creation Mechanism

* **`spawn()`**: Uses the system's native process creation mechanism. On Unix-like systems, it typically uses `fork` 
  followed by `exec` (or `posix_spawn` for better performance in some cases). On Windows, it uses `CreateProcess`.
* **`fork()`**: Creates a new V8 JavaScript engine instance along with the new process. This means each forked process 
  runs in its own isolated JavaScript environment. Because of that, this will be slower at scale, more CPU and RAM 
  intensive, and not the best option for very short-lived processes.

### 3. Communication

* **`spawn()`**: Communicates with the child process through streams (`stdin`, `stdout`, `stderr`). You have to manually 
  manage the data flowing through these streams.
* **`fork()`**: Automatically creates an IPC (Inter-Process Communication) channel between the parent and child 
  processes using `process.send()` and `process.on('message')`. This makes it easier to send and receive messages and 
  data between the processes.

### 4. Sharing Resources

* **`spawn()`**: Does not share memory with the parent process by default. Data is passed through streams.
* **`fork()`**: Because each process has its own V8 engine instance, Node.js by default has no memory sharing between 
  processes.

### 5. Performance and Overhead

* **`spawn()`**: Generally has lower overhead for starting processes, especially when running non-Node.js executables.
  It doesn't need to initialize a new JavaScript runtime.
* **`fork()`**: Has higher overhead because it needs to create a new V8 engine instance. Fork should be best used for
  long-running services that require multi-threading or core delegation to other processes.

### Code Examples

**`spawn()` Example (Running `ls` command):**

```javascript
const {spawn} = require('child_process');

const ls = spawn('ls', ['-l', '/tmp']);

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
```

**`fork()` Example (Running a separate Node.js file):**

```javascript
// parent.js
const {fork} = require('child_process');

const child = fork('child.js');

child.on('message', (message) => {
    console.log('Message from child:', message);
});

child.send({hello: 'world'});
```

```javascript
// child.js
process.on('message', (message) => {
  console.log('Message from parent:', message);
  process.send({ received: 'message' });
});
```

Another Example

Api `third` will be faster as it create process for each longComputation away from main thread.
```js
// fork_demo.js
const express = require('express');
const { fork } = require('child_process');

const app = express();

app.get('/one', (req, res) => {
  const sum = longComputation();
  res.send({ sum: sum });
});

app.get('/two', async (req, res) => {
  const sum = await longComputePromise();
  res.send({ sum: sum });
});

app.get('/three', (req, res) => {
  const child = fork('./longtask.js');
  child.send('start');
  child.on('message', (sum) => {
    res.send({ sum: sum });
  });
});

app.listen(3000, () => console.log('server on port 3000...'));

function longComputation() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  }
  return sum;
}

function longComputePromise() {
  return new Promise((resolve, reject) => {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
      sum += i;
    }
    resolve(sum);
  });
}
```

```js
// longtask.js
function longComputation() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  }
  return sum;
}

process.on('message', (message) => {
  if (message === 'start') {
    const sum = longComputation();
    process.send(sum);
  }
});    
```

### When to Use Which

* **Use `spawn()` when:**
    * You need to execute an external command or application (e.g., image processing, video encoding, shell scripts).
    * You need to stream data to or from an external process.
    * You're not running Node.js code in the child process.
    * Performance overhead of process creation is a concern.

* **Use `fork()` when:**
    * You need to create worker processes to handle CPU-intensive tasks in Node.js.
    * You want to isolate parts of your Node.js application into separate processes.
    * You need a simple and reliable way to communicate between parent and child Node.js processes using messages.
    * You need processes to be able to act on the same data, or use the same database, but prevent one from writing at the same time as another.

## Detailed Look at `spawn()`

The `spawn()` function in Node.js is part of the `child_process` module and is a powerful tool for executing external commands or applications as separate processes. It offers a more flexible and efficient way to run external programs compared to functions like `exec()`, particularly when dealing with long-running processes or large amounts of data.

### What `spawn()` Does:

`spawn()` launches a new process with the available set of commands (or executable) on the system. This new process runs independently of the main Node.js process. The key advantage is that `spawn()` provides access to the streams (standard input, standard output, and standard error) of the child process, allowing for real-time interaction and monitoring.

### Key Characteristics:

* **Non-blocking:** `spawn()` returns immediately. The child process runs in the background.
* **Stream-based:** Provides access to the child process's `stdout`, `stderr`, and `stdin` streams. You can read data from `stdout` and `stderr`, and write data to `stdin`.
* **Efficient for Long-Running Processes:** Better suited for processes that run for an extended period or generate large amounts of data because data is handled in streams rather than buffering the entire output into memory.
* **Direct Process Creation:** `spawn()` doesn't generate a new V8 instance. It uses the system's native process creation mechanisms (e.g., `fork` on Unix-like systems, `CreateProcess` on Windows). This is more efficient than creating a new Node.js instance.
* **Single Node.js Module Instance:** Only a single copy of the node module is active on the processor. This ensures consistency if multiple processes are launched using the same module.

### Syntax:

```javascript
const {spawn} = require('child_process');

const child = spawn(command, [args], [options]);
```

* **`command` (string):** The command to execute (e.g., `'ls'`, `'python'`, `'my_script.exe'`).
* **`args` (array, optional):** An array of command-line arguments to pass to the command (e.g., `['-l', '/home']`).
* **`options` (object, optional):** An object containing various options for the child process. Common options include:
    * `cwd` (string): Current working directory of the child process.
    * `env` (object): Environment variables for the child process.
    * `stdio` (string or array): Configures the standard input, output, and error streams. Defaults to `'pipe'` for all three. Can be `'pipe'`, `'ignore'`, `'inherit'`, or a file descriptor.
    * `detached` (boolean): If `true`, the child process will be a process group leader and detached from the parent's terminal.
    * `shell` (boolean): If `true`, runs the command inside a shell (e.g., `/bin/sh` on Unix, `cmd.exe` on Windows). This is useful for commands with shell-specific syntax (e.g., pipes, variable expansion). **Use with caution, as it can introduce security risks if the command is based on user input.**

### Example 1: Listing Files in a Directory

```javascript
const {spawn} = require('child_process');

const ls = spawn('ls', ['-l', '/home']); // Linux/macOS
// For Windows: const ls = spawn('dir', ['/B', 'C:\\']);  //Example with Windows command

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

ls.on('error', (err) => {
  console.error('Failed to start child process.', err);
});
```

### Example 2: Passing Data to a Child Process (using Python)

```javascript
const {spawn} = require('child_process');

const python = spawn('python', ['-c', 'import sys; data = sys.stdin.read(); print(data.upper())']); // Simple python inline program

python.stdout.on('data', (data) => {
  console.log(`Python script output: ${data}`);
});

python.stderr.on('data', (data) => {
  console.error(`Python script error: ${data}`);
});

python.on('close', (code) => {
  console.log(`Python script exited with code ${code}`);
});

python.stdin.write('hello, world!\n');
python.stdin.end(); // Indicate no more data will be sent
```

### Example 3: Using Shell Option

```javascript
const {spawn} = require('child_process');

// Caution: shell=true can be a security risk if command is user-controlled
const child = spawn('echo $HOME', {shell: true}); // Unix
// For Windows: const child = spawn('echo %USERPROFILE%', { shell: true });

child.stdout.on('data', (data) => {
  console.log(`Output: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});
```

### Example 4: Running `ping` Command

```javascript
const {spawn} = require('child_process');

const ping = spawn('ping', ['8.8.8.8']); // Google's public DNS server

ping.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ping.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ping.on('close', (code) => {
    console.log(`ping process exited with code ${code}`);
});
```

### Important Considerations for `spawn()`:

* **Error Handling:** Always include error handling for both the `spawn()` function itself (the `error` event) and the child process's streams (the `stderr` stream).
* **Encoding:** When reading data from `stdout` and `stderr`, be mindful of the encoding used by the child process. You can use `Buffer.toString('utf8')` or other encoding methods to convert the data to a string.
* **Asynchronous Nature:** Remember that `spawn()` is asynchronous. Use callbacks, Promises, or async/await to manage the execution flow and ensure that you handle the results of the child process correctly.
* **Resource Cleanup:** If the child process creates files or uses other resources, make sure to clean them up properly when the process exits.

## Understanding `exec()` and `execSync()`

### `exec()`

The `exec()` method runs a command in a shell and buffers the output. It's convenient for commands with limited output.

```javascript
const {exec} = require('child_process');

exec('node -v', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
```

### `execSync()`

The `execSync()` method is the synchronous version of `exec()`. It blocks the Node.js event loop until the command 
completes.

**test.js**

```javascript
const child_process = require('child_process');

const output = child_process.execSync('node test2.js');

console.log(output.toString());
```

**test2.js**
```javascript
console.log('console log from test2.js');
```

Running this will output:
```
console log from test2.js
```

## Comparing Concurrency Approaches in Node.js

Node.js offers multiple approaches for concurrency, each with different characteristics:

### Comparison Table: Clustering, Child Processes, and Worker Threads

| Feature              | Clustering                                    | Child Processes                                                | Worker Threads                                                |
|----------------------|-----------------------------------------------|----------------------------------------------------------------|---------------------------------------------------------------|
| Process Model        | Multiple copies of the same app               | Independent processes (can run different code)                 | Threads within the same Node.js process                       |
| Memory Space         | Separate                                      | Separate                                                       | Shared (with restrictions)                                    |
| Communication        | Limited (control signals)                     | IPC (pipes, sockets)                                           | Message passing, SharedArrayBuffer                            |
| Isolation            | High                                          | High                                                           | Lower (potential for process-wide crash)                      |
| Use Cases            | Multi-core CPU utilization, availability      | Running external programs, offloading heavy tasks              | I/O-bound tasks, parallelizing CPU tasks within one process   |
| Overhead             | Moderate (process creation)                   | High (process creation, IPC)                                   | Low (thread creation)                                         |
| Code Complexity      | Relatively simple                             | More complex (IPC, error management)                           | More complex (shared memory, synchronization)                 |

### Cluster Module Example

```javascript
// cluster.js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); // Replace the worker
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`hello from worker ${process.pid}\n`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

### Worker Threads Example

```javascript
// main.js (Main thread)
const { Worker } = require('worker_threads');

function runWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', { workerData });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

async function main() {
    const promises = [];
    const workerDataArray = [{ data: 10 }, { data: 12 }, { data: 15 }];

    for (const workerData of workerDataArray) {
        promises.push(runWorker(workerData));
    }

    const results = await Promise.all(promises);

    console.log('Results from workers:', results);
}

main().catch(err => console.error(err));
```

```javascript
// worker.js (Worker thread)
const { parentPort, workerData } = require('worker_threads');

function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const { data } = workerData;

const result = fibonacci(data);
parentPort.postMessage(result);
```

## Summary Table: Child Processes and Concurrency Methods

| Feature              | `child_process` (General)            | `worker_threads`        | `cluster`                       | `spawn`                                       | `fork`                                           |
|----------------------|--------------------------------------|-------------------------|---------------------------------|-----------------------------------------------|--------------------------------------------------|
| **Process Type**     | New OS Process                       | Thread (Within V8)      | New OS Process                  | New OS Process                                | New Node.js OS Process                           |
| **Memory Space**     | Isolated                             | Shared (with caution)   | Isolated                        | Isolated                                      | Isolated                                         |
| **Communication**    | stdio, IPC                           | Message passing         | IPC                             | stdio streams                                 | IPC                                              |
| **Primary Use Case** | External commands, process isolation | CPU-intensive tasks     | Scaling web applications        | Running external commands with stream access  | Simplified Node.js child process communication   |
| **Overhead**         | Higher                               | Lower                   | Higher                          | Higher                                        | Higher than worker threads, lower than spawn     |

## When to Use Which Approach

### Use Clustering When:
- You want to take advantage of all CPU cores to handle more incoming requests
- You need to improve application availability by running multiple instances
- You don't need to run fundamentally different code in different processes

### Use Child Processes When:
- You need to run CPU-intensive tasks that would block the main Node.js event loop
- You need to run external programs or scripts
- You want strong isolation between tasks to prevent crashes from affecting the main process
- You need to utilize multiple CPU cores effectively

### Use Worker Threads When:
- You need to offload I/O-bound tasks from the main thread to improve responsiveness
- You need to parallelize CPU-bound tasks within a single Node.js process without the overhead of creating separate processes
- You need to share data between threads efficiently (using `SharedArrayBuffer`)

### Use `spawn()` When:
- You need to execute an external command or application
- You need to stream data to or from an external process
- You're not running Node.js code in the child process
- Performance overhead of process creation is a concern

### Use `fork()` When:
- You need to create worker processes to handle CPU-intensive tasks in Node.js
- You want to isolate parts of your Node.js application into separate processes
- You need a simple and reliable way to communicate between parent and child Node.js processes





# Node.js Child Process Methods: Complete Comparison

## Overview

Node.js provides several methods for spawning child processes, each with distinct characteristics and use cases. This comparison covers the key aspects of each method.

## Comparison Table

| Feature             | `exec()`              | `execFile()`      | `spawn()`     | `fork()`          | `execSync()`        | `spawnSync()`         | `execFileSync()`     |
|---------------------|-----------------------|-------------------|---------------|-------------------|---------------------|-----------------------|----------------------|
| **Shell Usage**     | Yes                   | No                | Optional      | No                | Yes                 | Optional              | No                   |
| **Output Handling** | Buffered              | Buffered          | Streamed      | Streamed          | Buffered            | Streamed              | Buffered             |
| **Execution**       | Async                 | Async             | Async         | Async             | Sync                | Sync                  | Sync                 |
| **Memory Usage**    | Higher                | Higher            | Lower         | Lower             | Higher              | Lower                 | Higher               |
| **IPC Channel**     | No                    | No                | No            | Yes               | No                  | No                    | No                   |
| **Best For**        | Simple shell commands | Executable files  | Large outputs | Node.js processes | Blocking operations | Blocking with streams | Blocking executables |
| **Max Output Size** | Limited by buffer     | Limited by buffer | Unlimited     | Unlimited         | Limited by buffer   | Unlimited             | Limited by buffer    |
| **Error Handling**  | Callback              | Callback          | Event-based   | Event-based       | Try/catch           | Return value          | Try/catch            |

## Detailed Comparison

### `exec()`
- **Command execution**: Runs command in a shell (`/bin/sh` on Unix, `cmd.exe` on Windows)
- **Output handling**: Buffers the entire output in memory
- **Max buffer size**: Default 1MB (configurable)
- **Use case**: Simple shell commands with limited output
- **Pros**: Shell features available (pipes, redirects, etc.)
- **Cons**: Security risks with user input, memory limitations for large outputs, for long output script it may throw 
  error `stdout maxBuffer length exceeded.`

```javascript
const { exec } = require('child_process');
exec('ls -la', (error, stdout, stderr) => {
  console.log(stdout);
});
```

### `execFile()`
- **Command execution**: Directly executes a file without a shell
- **Output handling**: Buffers the entire output in memory
- **Max buffer size**: Default 1MB (configurable)
- **Use case**: Running executable files, binary file(faster & safer) with limited output
- **Pros**: More efficient than `exec()` for file execution, no shell injection risks
- **Cons**: No shell features, memory limitations for large outputs

```javascript
const { execFile } = require('child_process');
execFile('node', ['--version'], (error, stdout, stderr) => {
  console.log(stdout);
});
```

Another example
```shell
#somefile.sh

#!/bin/bash

ls -lh
```

```js
const { execFile, exec } = require('child_process');

exec('chmod +x ./somefile.sh', (error) => {
  if (error) {
    console.log(`chmod error: ${error.message}`);
    return;
  }

  execFile('./somefile.sh', (error, stdout, stderr) => {
    if(error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if(stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
  })
});
```

### `spawn()`
- **Command execution**: Launches a new process without a shell by default
- **Output handling**: Returns streams (`stdout`, `stderr`) for real-time data processing
- **Max buffer size**: N/A (streaming)
- **Use case**: Long-running processes, handling large data outputs or real-time output streaming
- **Pros**: Efficient memory usage, real-time data processing
- **Cons**: More complex to handle than buffered methods, no built-in shell features (unless opted in)

```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-la']);
ls.stdout.on('data', (data) => {
  console.log(`Output: ${data}`);
});
```

### `fork()`
- **Command execution**: Specialized for creating Node.js child processes
- **Output handling**: Streaming + message-based communication
- **Max buffer size**: N/A (streaming)
- **Use case**: Offloading CPU-intensive tasks to separate Node.js processes, multi-processing and parallel execution in
  NodeJS
- **Pros**: Built-in IPC channel, easy message passing, isolated process
- **Cons**: Higher overhead than worker threads, separate memory space

```javascript
const { fork } = require('child_process');
const child = fork('worker.js');
child.send({ data: 'processThis' });
child.on('message', (message) => {
  console.log('Result:', message);
});
```

### `execSync()`
- **Command execution**: Synchronous version of `exec()`, runs in a shell
- **Output handling**: Returns entire output as string/buffer
- **Max buffer size**: Default 1MB (configurable)
- **Use case**: Simple blocking operations where script must wait for result
- **Pros**: Simplicity, guaranteed sequential execution
- **Cons**: Blocks event loop, can lead to poor performance, memory limitations

```javascript
const { execSync } = require('child_process');
const output = execSync('ls -la');
console.log(output.toString());
```

### `spawnSync()`
- **Command execution**: Synchronous version of `spawn()`
- **Output handling**: Returns object with stdout/stderr as Buffer objects
- **Max buffer size**: N/A (depends on implementation)
- **Use case**: Blocking operations requiring more control
- **Pros**: Better performance than `execSync()` for large outputs
- **Cons**: Blocks event loop

```javascript
const { spawnSync } = require('child_process');
const result = spawnSync('ls', ['-la']);
console.log(result.stdout.toString());
```

### `execFileSync()`
- **Command execution**: Synchronous version of `execFile()`
- **Output handling**: Returns entire output as string/buffer
- **Max buffer size**: Default 1MB (configurable)
- **Use case**: Blocking operations on executable files
- **Pros**: No shell injection risks, synchronous execution
- **Cons**: Blocks event loop, memory limitations

```javascript
const { execFileSync } = require('child_process');
const output = execFileSync('node', ['--version']);
console.log(output.toString());
```

## Performance and Resource Characteristics

### Memory Usage
- **Buffered methods** (`exec`, `execFile`, `execSync`, `execFileSync`):
    - Higher memory usage as entire output is stored in memory
    - May fail with large outputs (over the buffer limit)

- **Streaming methods** (`spawn`, `fork`, `spawnSync`):
    - Lower memory usage as data is processed in chunks
    - Better for large outputs or continuous data streams

### CPU and Process Overhead
- **`fork()`**: Highest overhead (new Node.js instance, V8 engine)
- **Shell methods** (`exec`, `execSync`): Higher overhead (shell process)
- **Direct execution** (`spawn`, `execFile`): Lower overhead

### Event Loop Impact
- **Synchronous methods** (`execSync`, `spawnSync`, `execFileSync`):
    - Block the event loop until completion
    - Can cause application unresponsiveness

- **Asynchronous methods** (`exec`, `execFile`, `spawn`, `fork`):
    - Non-blocking
    - Better for application responsiveness

## Security Considerations

### Shell Injection
- **Methods using shells** (`exec`, `execSync`):
    - Vulnerable to command injection if user input is not sanitized
    - Potentially dangerous with untrusted input

- **Direct execution methods** (`spawn`, `execFile`, `fork`):
    - Safer by default (no shell interpretation)
    - Arguments passed as array elements, not interpreted by a shell

## Choosing the Right Method

- **For simple shell commands with limited output**: `exec()` or `execSync()`
- **For running executable files**: `execFile()` or `execFileSync()`
- **For long-running processes or large outputs**: `spawn()` or `spawnSync()`
- **For parallel Node.js processing**: `fork()`
- **When performance is critical**: Consider `worker_threads` instead of child processes

## Error Handling

### Asynchronous Methods
```javascript
// exec/execFile
exec('command', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(`stdout: ${stdout}`);
});

// spawn/fork
const child = spawn('command');
child.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});
child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});
child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

### Synchronous Methods
```javascript
try {
  const output = execSync('command');
  console.log(output.toString());
} catch (error) {
  console.error(`Error: ${error.message}`);
}
```


### Resources
* [How to use the Fork method in child-process and do inter-process communication.](https://www.youtube.com/watch?v=7cFNTD73N88)
* [Node Child Process](https://www.geeksforgeeks.org/node-js-child-process/)