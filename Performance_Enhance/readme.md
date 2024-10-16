# Cluster Mode Performance Enhancement in Node.js

We cannot make Node.js use multiple threads directly, but we can make multiple copies of the same application run on
different cores of the CPU. This way, we can utilize the full potential of the CPU and enhance the performance of the
application. In cluster mode, multiple copies of the same Node.js application run on different cores of the CPU. This
allows full CPU utilization and enhanced performance. In this article, we will discuss how to enhance the performance
of a Node.js application using cluster mode.

## Cluster Mode in Node.js

In **cluster mode**, multiple instances (copies) of the same Node.js application run on different CPU cores. This allows
you to utilize all the CPU cores of a machine, enhancing the performance of your application by balancing the workload
across these cores. By default, Node.js runs on a single thread, which means it can only utilize one core of the CPU.
Cluster mode helps overcome this limitation, making it possible to scale an application to handle more traffic
efficiently.

### How It Works

- **Master Process**: In cluster mode, a **master process** is responsible for managing worker processes. The master
  listens for incoming requests and distributes them to the worker processes. The master process does not handle any
  application logic or perform heavy lifting—it simply coordinates workers.
- **Worker Processes**: The **worker processes** are clones of the main application process. These worker processes are
  responsible for handling the actual work (i.e., processing the incoming requests). Each worker runs on a separate CPU
  core and handles a portion of the traffic.
- **Load Balancing**: The master process acts as a load balancer. It distributes incoming requests to the worker
  processes in a round-robin fashion or based on system configurations. This ensures that each worker is actively
  utilized, and the incoming workload is efficiently spread across the available CPU cores.

### Cluster Module in Node.js

The `cluster` module is a built-in module in Node.js that provides a simple way to create worker processes that run on
different CPU cores. This allows you to scale Node.js applications beyond the limitations of the single-threaded event
loop.
- **Master Process Creation**: The master process creates worker processes using the `cluster.fork()` method.
- **Worker Process Creation**: Worker processes are identical instances of the application and are created to handle
  incoming requests.
- **Process Communication**: The master process and worker processes can communicate with each other using an
  inter-process communication (IPC) channel.

### Key Benefits of Using Cluster Mode

1. **Improved Performance**: By utilizing all the CPU cores of a machine, you can handle more requests concurrently,
   thus improving the performance of your Node.js application.
2. **Fault Tolerance**: If a worker process crashes, the master process can detect this and spawn a new worker to
   replace it, ensuring that your application stays available and resilient.
3. **Concurrency**: The worker processes operate independently, so you can handle a higher number of concurrent requests
   without overwhelming a single thread.

### Example: Using the `cluster` Module

```javascript
const cluster = require('cluster');
const http = require('http');
const os = require('os');
const express = require('express');

if (cluster.isMaster) {
    // Master process: Fork workers for each available CPU core
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    // Fork a worker process for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for worker exit and respawn if necessary
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Spawning a new worker...`);
        cluster.fork();
    });

} else {
    // Worker process: Create an Express server with two routes
    const app = express();

    // Function to simulate blocking work with a delay
    function doWork(duration) {
        const start = Date.now();
        while (Date.now() - start < duration) {}
    }

    // Route with a 5-second delay
    app.get('/delay', (req, res) => {
        doWork(5000);  // Simulate CPU-intensive work for 5 seconds
        res.send(`Hi There from Worker ${process.pid} (with 5s delay)`);
    });

    // Route without any delay
    app.get('/fast', (req, res) => {
        res.send(`Hi There from Worker ${process.pid} (no delay)`);
    });

    // Listen on port 8000
    app.listen(8000, () => {
        console.log(`Worker ${process.pid} started and listening on port 8000`);
    });
}
```

### Handling Slow and Fast Routes in Node.js: Why Clustering is Essential

In Node.js, the event loop is single-threaded, meaning that if one request is CPU-intensive and takes a long time to
process (like the `/delay` route), it can block the event loop. This means that other incoming requests, including fast
routes (like the `/fast` route), will also be blocked until the slow route completes, resulting in poor performance and 
delayed responses for all users.

### Problem Without Clustering

When an application is deployed **without clustering** and if it handles both CPU-intensive (slow) and I/O-bound (fast) 
tasks, the entire application runs on a single thread. This leads to the following issue:

- **Slow Route Blocks Fast Route**: If a user hits a slow route (e.g., `/delay` that simulates CPU-intensive work with a
  5-second delay), the event loop is occupied and cannot respond to the fast route (e.g., `/fast`) until the slow 
  operation finishes.

#### Example Scenario:

1. User A requests the `/delay` route (takes 5 seconds to respond).
2. During the 5 seconds, User B requests the `/fast` route.
3. User B’s request is delayed because the event loop is busy handling the slow `/delay` request.

This leads to poor user experience, where all incoming requests (even fast ones) are blocked by a slow route.

### How Clustering Solves This Problem

By using **clustering**, Node.js can fork multiple worker processes, and each worker can handle incoming requests
independently. This means:

- **Parallel Processing**: Each worker process runs on a separate CPU core and handles a subset of incoming requests. If 
  one worker is busy handling a slow request, other workers can still handle fast requests concurrently.
- **Non-blocking Performance**: Even if one worker is busy with a CPU-intensive task (like `/delay`), other workers can 
  quickly respond to non-blocking tasks (like `/fast`). This ensures that fast routes are not affected by slow routes, 
  leading to better performance and user experience.

### Conclusion

Using clustering in Node.js is an efficient way to handle applications that have a mix of slow and fast routes. 
Clustering allows the application to utilize multiple CPU cores, enabling parallel processing. As a result, slow routes
will not block the event loop, and fast routes can continue to deliver quick responses. This enhances the performance 
and scalability of your Node.js application without needing additional servers.

# Worker Threads in Node.js

Worker threads use the thread pool created by the underlying **libuv** library. Worker threads are useful for
**CPU-bound tasks**, such as heavy computations, as they offload these tasks from the main event loop, allowing Node.js
to continue handling I/O-bound tasks efficiently.

- **Thread Pool**: Worker threads are executed in a thread pool managed by `libuv`. Each worker thread can perform
  CPU-intensive tasks without blocking the main event loop.
- **Usage**: Worker threads are typically used when you need to perform CPU-heavy tasks like data processing, image
  manipulation, or cryptography, which would otherwise block the event loop and degrade the performance of your
  application.

## Conclusion

Using **cluster mode** is generally recommended for enhancing the performance of a Node.js application over worker
threads. Cluster mode is more stable, battle-tested, and easier to implement. Worker threads, while useful for CPU-bound
tasks, are more complex and less stable compared to cluster mode. They are still considered experimental for many use
cases and are not as widely used in production environments.





# Worker Threads
Worker thread use the thread pool which is created by libuv. Worker threads are useful for CPU-bound tasks to offload 
the main event loop. 

# Conclusion
Using cluster mode is recommended instead of worker threads for enhancing the performance of a Node.js application. As
cluster mode is more stable and reliable than worker threads also it is easier to implement also battle proven. Worker
thread is more complex and less stable than cluster mode, and also it is experimental.

# Example
```js
const express = require('express');
const app = express();

function doWork(duration) {
    const start = Date.now();
    while(Date.now() - start < duration) {}
}

app.get('/', (req, res) => {
    doWork(5000);
    res.send('Hi There');
});

app.listen(3000);
```
Run those to command to make application ready `npm init`, `npm install express --save` then `node app.js`. Now open
two tabs in browser and hit `http://localhost:3000/` in both tabs.

<img src="./images/Multiple_Instance.png" alt="Cluster Mode" />

As we can see I first hit `http://localhost:3000/` tab on the right side then the tab on the left side. So, tab on right
side waiting for the response from the server for the 5 seconds, after the response from right side is received then the
request from left side is started to process. This is because the Node.js is single threaded and it can process only one
request at a time. That's why right one get response at 5.01s and left one get response at 9.52s. Left one waited for the
(9.52 - 5.01 = 4.51) seconds for first request from the right side to complete. Here we are blocking entire event loop 
for 5 seconds that's mean our serve is not able to process any other request during that time.



# References
- [Node JS: Advanced Concepts](https://www.udemy.com/course/advanced-node-for-developers/)