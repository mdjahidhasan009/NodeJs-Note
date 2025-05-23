
# Node.js Internal Architecture Overview

Node.js bridges the gap between JavaScript and the underlying system by following this architectural flow:

### 1. **JavaScript Code We Write**
- This is the code written by the developer using JavaScript.

### 2. **Node.js Library - JavaScript Side**
- Location: `lib` folder in Node.js repository.
- This part of Node.js is implemented in JavaScript, allowing interaction with core Node.js APIs (e.g., file system, 
  networking).

### 3. **process.binding()**
- **Role**: A special function in Node.js that connects JavaScript functions to corresponding C++ functions.
- It acts as a bridge, allowing communication between the JavaScript world and the underlying C++ code.

### 4. **V8 Engine**
- **Role**: V8 is the JavaScript engine used by Node.js to run JavaScript code.
- **Functionality**: Converts JavaScript code into machine code and manages the runtime of JavaScript.
- **Bridge**: It facilitates data conversion between the JavaScript and C++ layers, enabling JavaScript functions to 
  call lower-level C++ code.
- **Just-In-Time (JIT) Compilation**: V8 uses JIT compilation, which translates JavaScript code into machine code during 
  execution, enabling faster execution compared to traditional interpretation.
- **Cross-platform Compatibility**: V8 is cross-platform due to which the Node.js application can run on that platforms.
- **Asynchronous I/O Efficiency**: The V8 engine can handle the non-blocking, asynchronous I/O operations which is 
  important for handling the multiple tasks in Node.js.
- **Garbage Collection**: V8 has an efficient garbage collection mechanism that helps in memory management, 
  automatically reclaiming memory that is no longer in use.
- **High Performance**: V8 is a highly optimized JavaScript engine designed for speed. It compiles JavaScript directly 
  into machine code, which makes it much faster than interpreted JavaScript

### 5. **Node Library - C++ Side**
- Location: `src` folder in Node.js repository.
- This part of Node.js is implemented in C++ and interacts directly with the underlying system through system calls.
- The C++ side exposes functionalities like file system access, network sockets, etc., which are unavailable in the 
  JavaScript side alone.

### 6. **libuv**
- **Role**: libuv is a multi-platform library that provides Node.js access to the operating system’s asynchronous I/O 
  capabilities.
- It abstracts the complexity of dealing with asynchronous I/O (file handling, networking, etc.) and event-driven 
  programming.

### Full Flow Summary:
1. **We Write JavaScript Code**.
2. The **JavaScript Code** interacts with the **Node.js Library (JS Side)** located in the `lib` folder of the Node.js 
   repository.
3. The **process.binding()** function bridges the **JavaScript Side** to the **C++ Side**.
4. The **V8 Engine** translates and converts values between JavaScript and the C++ world.
5. The **Node C++ Library** handles system-level operations, exposed through the `src` folder of the Node.js repository.
6. Finally, **libuv** facilitates access to the underlying operating system’s asynchronous I/O capabilities.

### Resources:
* [NodeJS Interview Questions and Answers](https://www.geeksforgeeks.org/node-interview-questions-and-answers/)