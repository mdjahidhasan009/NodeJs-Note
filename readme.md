# NodeJs
Node.js is an **open-source**, **cross-platform**, **JavaScript runtime environment** that executes JavaScript code 
outside a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side 
scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web 
browser. Consequently, Node.js represents a "JavaScript everywhere" paradigm, unifying web-application development 
around a single programming language, rather than different languages for server- and client-side scripts.

Node.js use **an event-driven**, **non-blocking I/O** model that makes it lightweight and efficient, perfect for
**data-intensive real-time applications** that run across distributed devices.

## Standard Library Modules in Node.js
Node.js has a standard library that provides a set of asynchronous I/O primitives. It's a single-threaded event loop
and a non-blocking I/O. It's a single-threaded event loop and a non-blocking I/O.

### `http` Module
The `http` module allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP). It's a core module that
provides the basic HTTP server and client functionality.

### `fs` Module
The `fs` module provides an API for interacting with the file system in a manner closely modeled around standard POSIX
functions.

### `crypto` Module
The `crypto` module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher,
decipher, sign, and verify functions.

### `path` Module
The `path` module provides utilities for working with file and directory paths.

### `os` Module
The `os` module provides a number of operating system-related utility methods.

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

