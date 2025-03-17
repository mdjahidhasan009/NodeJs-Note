# NodeJs
Node.js is an **open-source**, **cross-platform**, **JavaScript runtime environment** that executes JavaScript code 
outside a web browser. 

Node.js lets developers use JavaScript to write **command line tools** and for **server-side scripting—running scripts** 
server-side to produce dynamic web page content before the page is sent to the user's web browser. Consequently, Node.js
represents a "JavaScript everywhere" paradigm, unifying web-application development around a single programming 
language, rather than different languages for server- and client-side scripts.

Node.js use **an event-driven**, **non-blocking I/O** model that makes it lightweight and efficient, perfect for
**data-intensive real-time applications** that run across distributed devices also I/O intensive web applications like
video streaming sites, real time web application, network applications, and more.


**Node.js used for:**
* Real-time web applications(Chat, Games, Collaboration Tools)
* Internet of Things (IoT)
* Complex SPAs(Single Page Applications)
* Streaming Applications
* Microservices 

## Standard Library Modules in Node.js
Node.js has a standard library that provides a set of asynchronous I/O primitives. It's a single-threaded event loop
and a non-blocking I/O. It's a single-threaded event loop and a non-blocking I/O.

### `http` Module
The `http` module allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP). It's a core module that
provides the basic HTTP server and client functionality. Includes classes, methods, and events to create a Node.js HTTP 
server

### `fs` Module
The `fs` module provides an API for interacting with the file system in a manner closely modeled around standard POSIX
functions. Includes events, classes, and methods to work with file I/O operations.

### `crypto` Module
The `crypto` module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher,
decipher, sign, and verify functions.

### `path` Module
The `path` module provides utilities for working with file and directory paths.

### `os` Module
The `os` module provides a number of operating system-related utility methods.

### 'util' Module
The `util` module provides utility functions useful for programmers.

## `url` Module
The `url` module provides utilities for URL resolution and parsing.

### `querystring` Module
The `querystring` module provides utilities for parsing and formatting URL query strings.

### `stream` Module
The `stream` module provides the API for implementing the stream interface.

### `zlib` Module
The `zlib` module provides compression and decompression functionalities.

etc. Those are mostly implemented in libuv and V8.

## V8 JavaScript Engine
It use the **V8 JavaScript engine** developed by Google for use in Chrome. V8 compiles JavaScript into machine code
instead of interpreting it in real time. Node.js is bundled with a set of built-in modules that are written in JavaScript
and handle tasks such as **networking**, **HTTP requests**, and **file system I/O**—functions that are essential to most
web applications. It runs node.js javascript code in a separate thread outside the browser and provides a way to
communicate with the browser. It's written in C++ and JavaScript.

## libuv
Node.js is primarily used to build network programs such as web servers. The majority of the basic modules are written in
JavaScript, although Node.js has also been used to write native addons in C++.



# Uploading Files to Node.js Server and Saving to S3

Uploading files directly to the server and then saving them to S3 is not scalable as it consumes significant server CPU 
and memory resources. A more efficient approach is to upload files directly to S3 from the client side.

## Why Upload Directly to S3?

Uploading files directly to S3 avoids the server being involved in the file upload process. By using the AWS SDK to
generate a pre-signed URL, the client can upload the file directly to S3.

### Advantages of Direct Upload to S3:
- **Reduced server load:** No need for the server to process file uploads, reducing memory and CPU usage.
- **Improved scalability:** File uploads are handled by S3, which is highly scalable, instead of burdening your server.
- **Security benefits:** Pre-signed URLs ensure that uploads are secure, as each URL is generated with specific 
  permissions and constraints.

## Key Features for Security
| **Feature**                                                 | **Security Issue Solved**                                                           |
|-------------------------------------------------------------|-------------------------------------------------------------------------------------|
| URL can only be used for a single file upload               | Users cannot spam our S3 bucket with many files                                     |
| URL encodes the file name and type of file                  | Users cannot request a URL for one file then upload a different file                |
| URL can expire                                              | Prevents some exploits, like a malicious user trying to get a URL from another user |
| URL is generated by a secure request between server and AWS | Users cannot 'fake' their own upload URL                                            |
| URL only works for the S3 bucket it is created for          | Users cannot use the URL for other S3 buckets that belong to us                     |

By following this approach, we offload the file processing to S3, making our application more efficient and scalable.


# Node.js vs Laravel, ASP.NET Core, Spring Boot – Handling Multiple Requests

## 1. How Node.js Handles Multiple Requests
- Node.js is **non-blocking and event-driven**.
- Uses a **single-threaded event loop** to handle many requests at the same time.
- **Does not wait** for one request to finish before handling the next.
- Uses **asynchronous I/O operations** (callbacks, promises, async/await) to keep things moving.
- **Best for** real-time apps (e.g., chat apps, live updates, APIs).

### Example (Node.js Express API):
```javascript
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
    console.log("Fetching users...");
    setTimeout(() => {  // Simulating database delay
        res.send("User data retrieved!");
        console.log("Users sent!");
    }, 5000); // 5 seconds delay
});

app.get('/orders', (req, res) => {
    console.log("Fetching orders...");
    setTimeout(() => {  // Simulating database delay
        res.send("Order data retrieved!");
        console.log("Orders sent!");
    }, 2000); // 2 seconds delay
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
- The second request (`/orders`) **does not wait** for the first request (`/users`) to complete.
- Both are processed **in parallel** using Node.js' event loop.

---

## 2. How Other Frameworks Handle Multiple Requests

| Framework                | Concurrency Model                 | Handles Multiple Requests?   | How It Works                                                                  |
|--------------------------|-----------------------------------|------------------------------|-------------------------------------------------------------------------------|
| **Node.js** (JavaScript) | Single-threaded, Non-blocking     | ✅ Yes (without waiting)      | Uses event loop & async I/O                                                   |
| **Laravel** (PHP)        | Multi-threaded (via PHP-FPM)      | ✅ Yes (via worker processes) | Uses **PHP-FPM**, which spawns multiple threads/processes to handle requests. |
| **ASP.NET Core** (C#)    | Multi-threaded with Async Support | ✅ Yes                        | Uses multiple threads & async/await. Optimized with Kestrel server.           |
| **Spring Boot** (Java)   | Multi-threaded (Thread Pool)      | ✅ Yes                        | Uses a thread pool where each request gets a separate thread.                 |

---

## 3. Laravel (PHP) – Multi-Threaded via PHP-FPM
- **PHP is synchronous by default** (one request blocks execution).
- Uses **PHP-FPM (FastCGI Process Manager)** to handle multiple requests **in parallel**.
- **PHP-FPM creates multiple worker processes**, each handling one request at a time.
- Unlike Node.js, it does **not use a single-threaded event loop**, but multiple **threads or processes**.

---

## 4. ASP.NET Core (C#) – Multi-Threaded with Async Support
- Uses a **multi-threaded model** where each request is handled by a separate thread.
- Supports **async/await**, allowing efficient I/O operations.
- Optimized with **Kestrel Web Server** for handling high concurrency.

---

## 5. Spring Boot (Java) – Multi-Threaded (Thread Pool)
- Uses a **thread pool** where each request gets assigned a separate thread.
- Can scale by managing the **number of threads** dynamically.
- Ideal for **large-scale enterprise applications**.

---

## 6. Key Differences
- **Node.js is best for I/O-heavy, real-time applications** because it does not spawn multiple threads but uses a 
  single-threaded event loop.
- **Laravel, ASP.NET Core, and Spring Boot use multi-threading** to handle concurrent requests.
- **PHP-FPM allows Laravel to process multiple requests using worker processes.**

---

### TL;DR
✅ **Node.js is non-blocking & single-threaded, handling thousands of requests efficiently using async I/O.**  
✅ **Laravel (PHP), ASP.NET Core, and Spring Boot use multi-threading to handle requests in parallel.**  
✅ **PHP-FPM allows Laravel to handle multiple requests at the same time by creating worker threads.**




## Node.js Event-Driven Architecture
Here's a breakdown of why Node.js is event-driven and its implications:

**What does "event-driven" mean?**

*   **Events:** Node.js operates by reacting to events.  An event can be anything like:
  *   A client connection request (e.g., a browser making an HTTP request)
  *   Data arriving from a file system
  *   A timer expiring
  *   A network socket becoming ready for reading or writing
*   **Event Loop:**  The heart of Node.js is the **event loop**.  It's a single-threaded loop that continuously monitors 
  for events and executes the corresponding callback functions when an event occurs.
*   **Callback Functions:**  When an event happens, Node.js doesn't wait for it to complete synchronously (blocking the 
  thread). Instead, it registers a **callback function** to be executed *later* when the event has finished. This allows
  the main thread to remain free to handle other requests.

**How it works in Node.js:**

1.  **Event Listener:**  You register an event listener for a specific event (e.g., `server.on('request', callback)`
  listens for incoming HTTP requests).
2.  **Event Loop Monitoring:**  The event loop continuously monitors for events happening in the system.
3.  **Event Triggered:** When an event occurs (e.g., a client sends an HTTP request), the event is added to the event 
  queue.
4.  **Callback Execution:** The event loop picks up the event from the queue and executes the associated callback 
  function.  The callback function handles the event (e.g., processes the HTTP request, reads data from the file, etc.).
5.  **Non-Blocking I/O:**  Crucially, Node.js uses *non-blocking* I/O operations.  When your callback function needs to 
  perform an I/O operation (like reading a file or making a network request), Node.js initiates the operation in the 
  background *without* blocking the main thread.  It then registers another callback to be executed when the I/O 
  operation completes.
6.  **Back to the Loop:**  After executing a callback, the event loop returns to monitoring for new events.

**Example:**

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // This is the callback function that will be executed when
  // an HTTP request is received.
  console.log('Request received!');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, world!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

In this example:

*   `http.createServer()` creates an HTTP server.
*   The function passed to `createServer()` is the callback function.
*   `server.listen(3000)` starts the server and tells it to listen for connections on port 3000.
*   When a client makes a request to the server on port 3000, the callback function is executed.  The server logs 
  "Request received!" to the console and sends the "Hello, world!" response back to the client.
*   The key point is that the server doesn't block waiting for a request.  It continues to listen for new requests while
  the callback function is executing.

**Benefits of Event-Driven Architecture in Node.js:**

*   **Concurrency:** Node.js can handle many concurrent requests without creating a new thread for each request. This 
  makes it very efficient for I/O-bound applications.  The event loop handles requests in a non-blocking manner, 
  preventing the server from being bogged down by slow I/O operations.
*   **Scalability:**  Because it's lightweight and efficient, Node.js scales well.  You can handle a large number of 
  concurrent connections on a single server.
*   **Responsiveness:**  Applications built with Node.js tend to be very responsive because the event loop ensures that 
  no single operation blocks the main thread for a long time.
*   **Real-time Applications:**  The event-driven nature of Node.js makes it well-suited for real-time applications like
  chat servers, online games, and streaming applications, where low latency is critical.

**In summary, yes, Node.js is fundamentally event-driven. Its architecture relies on the event loop and non-blocking I/O 
to handle concurrency efficiently, making it a powerful platform for building scalable and responsive applications.**


### Resources
- [Top 100+ Node.js Interview Questions and Answers for 2025](https://www.simplilearn.com/tutorials/nodejs-tutorial/nodejs-interview-questions)