# NodeJs
Node.js is an **open-source**, **single-threaded**, **non-blocking asynchronous I/O**, **cross-platform**,**JavaScript 
runtime environment** that executes JavaScript code outside a web browser. 

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

## Asynchronous API Call
All APIs of Node.js library are aynchronous that is non-blocking. It essentially means a Node.js based server never 
waits for a API to return data. Server moves to next API after calling it and a notification mechanism of Events of
Node.js helps server to get response from the previous API call.

## Runtime Environment
Engines are the core of JavaScript runtime environments. They are responsible for executing JavaScript code. Different
browsers use different engines to run JavaScript code. Here are some of the most popular JavaScript engines:
* Chrome - V8 Engine
* Firefox - SpiderMonkey
* Safari - JavaScriptCore
* Edge - Chakra

Now Node.js uses the V8 JavaScript Engine, which is the same engine used by Google Chrome. It provides a runtime
environment for executing JavaScript code on the server-side using explicitly the V8 engine. It also uses libuv library 
which provides an event loop  and thread pool for handling asynchronous I/O operations.

**Runtime Environment**: A runtime environment is a collection of software components that provide the necessary
infrastructure for executing a program. It includes the engine, libraries, and other components that are required to run
the program. The runtime environment is responsible for managing the execution of the program, including memory
management, input/output(I/O) operations, and error handling.

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

Node.js uses the **V8 JavaScript engine** developed by Google for Chrome. V8 compiles JavaScript into machine code 
instead of interpreting it in real time, providing high-performance execution. V8's primary role is to execute
JavaScript code and manage memory (including garbage collection), but it doesn't handle I/O operations directly. V8 is 
written in C++ and provides the JavaScript runtime environment that Node.js builds upon. It implements ECMAScript 
standards and optimizes JavaScript execution through just-in-time (JIT) compilation.

## libuv

**libuv** is a multi-platform C library that provides Node.js with its event loop and handles asynchronous I/O 
operations. It's responsible for implementing the core functionality that makes Node.js non-blocking, including **file 
system operations**, **networking**, and **timers**. libuv abstracts system-level operations across different operating
systems (Windows, Linux, macOS) and manages thread pooling for CPU-intensive tasks. When developers use Node.js modules
like `fs` for file operations or `http` for networking, these modules communicate with libuv under the hood to perform 
the actual I/O operations asynchronously. Node.js core modules act as JavaScript wrappers around libuv's C/C++ 
implementations.

Under the hood, Node.js is implemented using C++ and JavaScript . While it executes JavaScript code outside of the
browser, it does not run this code in a separate thread by default. Instead, it uses a single-threaded event loop model
with non-blocking I/O, which allows it to efficiently manage many concurrent operations. Blocking tasks like file system
access or cryptography are handled asynchronously using a thread pool provided by libuv .



# Uploading Files to Node.js Server and Saving to S3

Uploading files directly to the server and then saving them to S3 is not scalable as **it consumes significant server 
CPU and memory resources**. A more efficient approach is to upload files directly to S3 from the client side.

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

* **Events:** **Node.js operates by reacting to events**. An event can be anything like:
  * A client connection request (e.g., a browser making an HTTP request)
  * Data arriving from a file system
  * A timer expiring
  * A network socket becoming ready for reading or writing
* **Event Loop:** The heart of Node.js is the **event loop**. It's a single-threaded loop that continuously monitors for
  events and executes the corresponding callback functions when an event occurs.
* **Callback Functions:** When an event happens, Node.js doesn't wait for it to complete synchronously (blocking the 
  thread). Instead, it registers a **callback function** to be executed *later* when the event has finished. This allows
  the main thread to remain free to handle other requests.

**How it works in Node.js:**

1. **Event Listener:**  You register an event listener for a specific event (e.g., `server.on('request', callback)`
  listens for incoming HTTP requests).
2. **Event Loop Monitoring:**  The event loop continuously monitors for events happening in the system.
3. **Event Triggered:** When an event occurs (e.g., a client sends an HTTP request), the event is added to the event 
  queue.
4. **Callback Execution:** The event loop picks up the event from the queue and executes the associated callback 
  function.  The callback function handles the event (e.g., processes the HTTP request, reads data from the file, etc.).
5. **Non-Blocking I/O:**  Crucially, Node.js uses *non-blocking* I/O operations.  When your callback function needs to 
  perform an I/O operation (like reading a file or making a network request), Node.js initiates the operation in the 
  background *without* blocking the main thread.  It then registers another callback to be executed when the I/O 
  operation completes.
6. **Back to the Loop:**  After executing a callback, the event loop returns to monitoring for new events.

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

* `http.createServer()` creates an HTTP server.
* The function passed to `createServer()` is the callback function.
* `server.listen(3000)` starts the server and tells it to listen for connections on port 3000.
* When a client makes a request to the server on port 3000, the callback function is executed.  The server logs 
  "Request received!" to the console and sends the "Hello, world!" response back to the client.
* The key point is that the server doesn't block waiting for a request.  It continues to listen for new requests while
  the callback function is executing.

**Benefits of Event-Driven Architecture in Node.js:**

* **Concurrency:** Node.js can handle many concurrent requests without creating a new thread for each request. This 
  makes it very efficient for I/O-bound applications.  The event loop handles requests in a non-blocking manner, 
  preventing the server from being bogged down by slow I/O operations.
* **Scalability:**  Because it's lightweight and efficient, Node.js scales well.  You can handle a large number of 
  concurrent connections on a single server.
* **Responsiveness:**  Applications built with Node.js tend to be very responsive because the event loop ensures that 
  no single operation blocks the main thread for a long time.
* **Real-time Applications:**  The event-driven nature of Node.js makes it well-suited for real-time applications like
  chat servers, online games, and streaming applications, where low latency is critical.

**In summary, yes, Node.js is fundamentally event-driven. Its architecture relies on the event loop and non-blocking I/O 
to handle concurrency efficiently, making it a powerful platform for building scalable and responsive applications.**


## Disadvantages of Node.js
Node.js is a powerful platform for building fast, scalable, and real-time applications. However, like any technology, it
has its limitations and disadvantages. Here are some common drawbacks of Node.js:

#### Single-Threaded Nature
*   **CPU-Bound Tasks:** Node.js is not suitable for CPU-bound tasks that require heavy computation. Since it's 
    single-threaded, long-running CPU-bound tasks can block the event loop and make the application unresponsive.
*  **Blocking I/O:** While Node.js is excellent for non-blocking I/O operations, blocking I/O operations can still 
    impact performance. For example, reading large files synchronously can block the event loop and slow down the 
    application.
* **Limited Standard Library:** Node.js has a limited standard library compared to other platforms. Developers often 
    need to rely on third-party modules for common tasks, which can introduce security and maintenance issues.

#### Large Memory Footprint
* **Memory Usage:** Node.js consume huge memory for each connection. This can be a problem when handling a large number 
    of concurrent connections, as it can lead to high memory usage and potential memory leaks.
* **Garbage Collection:** Node.js uses automatic garbage collection to manage memory, which can cause performance 
    problems if not optimized. Developers need to be mindful of memory usage and garbage collection to avoid bottlenecks.
* **Memory Leaks:** Node.js applications can suffer from memory leaks if not managed properly. Since Node.js uses 
    JavaScript, developers need to be careful with memory management to avoid leaks.



**Features and Comparison: NodeJS, Python, Java Spring Boot, C# ASP.NET**

| Feature               | NodeJS                                                                                                              | Server-Side Scripting Languages (e.g., Python)                                                                                                               | Java Spring Boot                                                                                                                                | C# ASP.NET                                                                                                                         |
|-----------------------|---------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Platform**          | A runtime environment for executing JavaScript outside the browser.                                                 | A programming language that can be used for server-side scripting (e.g., Python, PHP, Ruby).                                                                 | A framework for building Java-based enterprise applications.                                                                                    | A framework for building web applications with C# and the .NET platform.                                                           |
| **Language**          | Built on JavaScript, primarily used for asynchronous programming.                                                   | Built on Python, which is synchronous by default, but can also be used for asynchronous programming.                                                         | Built on Java, a statically typed, object-oriented language.                                                                                    | Built on C#, a statically typed, object-oriented language.                                                                         |
| **Concurrency Model** | Non-blocking, event-driven I/O model using the Event Loop.                                                          | Thread-based concurrency (multi-threading) or asynchronous programming with frameworks like asyncio.                                                         | Thread-based concurrency using the Java Virtual Machine (JVM).                                                                                  | Thread-based concurrency with the Common Language Runtime (CLR).  Asynchronous support is good using async/await features.         |
| **Performance**       | Highly performant for I/O-heavy tasks but less efficient for CPU-heavy operations due to single-threaded nature.    | More suitable for CPU-heavy operations but can be less performant in handling high concurrency compared to NodeJS.                                           | Generally performant, well-suited for both I/O and CPU-bound tasks. Can be tuned for high concurrency.                                          | Generally performant, with optimizations for I/O and CPU-bound tasks.                                                              |
| **Use Case**          | Used for building fast, scalable, I/O-bound applications (e.g., APIs, real-time apps).                              | Commonly used for general-purpose programming, web development, and CPU-bound tasks (e.g., Django for web, machine learning with libraries like TensorFlow). | Used for building large-scale enterprise applications, microservices, REST APIs, and web applications.                                          | Used for building web applications (especially those integrated with Microsoft technologies), REST APIs, and enterprise solutions. |
| **Ecosystem**         | Large and active NPM ecosystem with many libraries and frameworks.                                                  | Large and diverse ecosystem with libraries for almost every task (e.g., data science, web frameworks).                                                       | Mature and robust ecosystem with a wide variety of libraries and frameworks. A big community.                                                   | Mature and robust ecosystem, especially within the Microsoft ecosystem. Large community and documentation.                         |
| **Type System**       | Dynamic (JavaScript)                                                                                                | Dynamic (Python)                                                                                                                                             | Static (Java)                                                                                                                                   | Static (C#)                                                                                                                        |
| **Deployment**        | Relatively easy to deploy with tools like Docker and serverless platforms.                                          | Generally straightforward to deploy, often relying on WSGI servers and deployment tools.                                                                     | Deployment typically involves packaging the application as a JAR or WAR file and deploying to a server (e.g., Tomcat, Jetty) or cloud platform. | Deployment options include IIS, Azure, Docker, and other platforms.                                                                |
| **Scalability**       | Can scale horizontally by adding more instances of the application.  Often relies on load balancers and clustering. | Can scale horizontally, but concurrency management can be more complex. Can be more memory intensive.                                                        | Can scale horizontally and vertically due to the JVM's memory management and multi-threading capabilities.                                      | Designed for scalability with features like asynchronous programming and support for cloud platforms.                              |

**Key Takeaways & Considerations:**

* **I/O vs. CPU:** If your application is primarily dealing with Input/Output operations (network requests, database 
  queries, etc.), NodeJS shines.  If it's CPU-intensive (complex calculations, image processing), Python, Java Spring
  Boot, or C# ASP.NET might be better choices *depending on other factors*.
* **Concurrency:** NodeJS's non-blocking, event-driven model is well-suited for handling many concurrent connections 
  efficiently.  Python, Java and C# needs more thought into async processing.
* **Ecosystem and Libraries:** All four technologies have rich ecosystems.  Choose the one that has the libraries and 
  frameworks you need for your specific project.  Python is a dominant force in data science and machine learning. Java 
  has lots of mature and robust enterprise libraries.  .NET has excellent tools for building Windows-centric
  applications.
* **Team Expertise:** This is crucial.  Select the technology your team is most comfortable and experienced with. 
  Developer productivity is often more important than raw performance in the long run.
* **Scalability Requirements:** Consider your long-term scalability needs. If you anticipate massive scaling needs,
  carefully evaluate the concurrency models and deployment options of each platform.
* **Integration:** Think about how your application needs to integrate with existing systems and technologies. If you 
  are heavily invested in the Microsoft ecosystem, then ASP.NET might be a natural choice. Java is ideal when you need 
  lots of legacy systems to work together.


### Resources
- [Top 100+ Node.js Interview Questions and Answers for 2025](https://www.simplilearn.com/tutorials/nodejs-tutorial/nodejs-interview-questions)
- [paulfranco/NodeJS Interview Questions](https://gist.github.com/paulfranco/9f88a2879b7b7d88de5d1921aef2093b)