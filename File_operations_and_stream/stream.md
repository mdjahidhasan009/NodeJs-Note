# Stream

## Readable Stream
> Read data from source

```js
const fs = require('fs');
const readStream = fs.createReadStream('./sample.txt', 'utf8');

let content = '';

readStream.on('data', (data) => {
    console.log(data);
    content += data;
});

readStream.on('end', () => {
    console.log('finished reading');
    console.log(content);
});
```

**Buffers and Readable Streams:**  The `data` event of a readable stream emits either a string (if an encoding like 
`'utf8'` is specified in `createReadStream`) or a `Buffer` object if no encoding is given. Buffers are Node.js's way of
representing raw binary data.  They are like arrays of bytes.

### Another Version
```js
const fs = require('fs');

const readStream = fs.createReadStream('./big_text.txt'); // No encoding specified

readStream.on('data', (chunk) => {
    console.log(chunk.toString()); // Convert Buffer to string for display
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('-------------------END OF CHUNK-------------------');
});
```

**Important (Without Encoding):**  If you *don't* specify an encoding when creating the readable stream (as in this 
"Another Version" example), the `chunk` will be a `Buffer`. You will need to convert the `Buffer` to a string using
`.toString()` to work with it as text, as shown above. This is crucial for handling binary data or text files without a
known encoding.

## Writeable Stream
> Write data to destination

```js
const fs = require('fs');
const writeStream = fs.createWriteStream('./sample.txt', 'utf8');

writeStream.write('Hello World'); // Can write a string or a Buffer
writeStream.end();

writeStream.on('finish', () => {
    console.log('finished writing');
});
```

**Buffers and Writable Streams:**  Writable streams accept either strings or `Buffer` objects as data to be written.  
If you're working with raw binary data, you'll write `Buffer` objects. If you specify an encoding in `createWriteStream`, 
you can also write strings, and Node.js will handle the conversion to binary.

## Duplex Stream
> Read and write data

### Without Pipe
```js
const fs = require('fs');

const readStream = fs.createReadStream('./input.txt', 'utf8');
const writeStream = fs.createWriteStream('./output.txt', 'utf8');

readStream.on('data', (chunk) => {
    writeStream.write(chunk);  // Chunk is a string because of 'utf8' encoding
});
```

### Pipe
Pipe is a method of readable stream. It is used to connect the output of one stream to another stream. It reads data from
a readable stream as it becomes available and writes it to a destination writable stream.

#### With Pipe
```js
const fs = require('fs');

const readStream = fs.createReadStream('./input.txt', 'utf8');
const writeStream = fs.createWriteStream('./output.txt', 'utf8');

readStream.pipe(writeStream);
```

**Piping and Buffers:** When you pipe streams, Node.js efficiently handles the data transfer. If the streams don't have
explicit encodings, `pipe` will typically transfer `Buffer` objects between them. This is very efficient for binary data. 
If encodings are set, `pipe` will handle the string conversion.

## Transform Stream
> Modify data

Transform streams are Duplex Streams (read/write) that transform data as it passes through.  A common example might be a 
stream that compresses or encrypts data. They also interact with buffers, and that depend on your transformation rules.

**Example:** (Illustrative - a simple transform stream)

```js
const {Transform} = require('File_operations_and_stream/stream');

class UppercaseTransform extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        const transformedChunk = chunk.toString().toUpperCase(); // or process Buffer directly
        this.push(transformedChunk);
        callback();
    }
}
```

In a transform stream's `_transform` method, `chunk` can be either a string or a Buffer depending on how the stream is
configured. You process this `chunk` and `push` the transformed data to the output of the stream.

# In server

### Read stream in server
This will create a node server and listen on port 3000. When we hit the root url it will show a form. When we submit the
form then the `process` API will be called and it will take the data as stream from the form api and will show the data
in the console.

Also, using `fileStream.write(chunk)` we are writing the data to the file as stream.

```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('<html><head><title>Form</title></head>');
        res.write(
            '<body><form method="post" action="/process"><input name="message" /></form></body>'
        );
        res.end();
    } else if (req.url === '/process' && req.method === 'POST') {
        const fileStream = fs.createWriteStream('message.txt'); // Create a writable stream

        req.on('data', (chunk) => {
            fileStream.write(chunk); // Manually write each chunk to the file
        });

        req.on('end', () => {
            fileStream.end(); // Close the file stream when request ends
            res.write('Thank you for submitting');
            res.end();
        });

        fileStream.on('error', (err) => {
            console.error('File write error:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
    } else {
        res.write('Not found');
        res.end();
    }
});

server.listen(3000);
console.log('listening on port 3000');
```

In most of the case we use `express` so the `express.json()` or `body-parser` will take care of the stream. But in this
case we are using the raw node server so we have to take care of the stream. That's why in those case data should be a
valid JSON. If it is not a valid JSON then it will throw an error.

**Using Pipe**
```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('<html><head><title>Form</title></head>');
        res.write(
            '<body><form method="post" action="/process"><input name="message" /></form></body>'
        );
        res.end();
    } else if (req.url === '/process' && req.method === 'POST') {
        const fileStream = fs.createWriteStream('message.txt'); // Create a writable stream

        req.pipe(fileStream); // Pipe the request stream to the file stream

        fileStream.on('finish', () => {
            res.write('Thank you for submitting');
            res.end();
        });

        fileStream.on('error', (err) => {
            console.error('File write error:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
    } else {
        res.write('Not found');
        res.end();
    }
});

server.listen(3000);
console.log('listening on port 3000');
```

**Buffers and HTTP Requests:** In these server examples, `req.on('data', (chunk) => { ... })` receives data from the 
request as chunks. These chunks can be strings (if the client sent data with an appropriate encoding) or more commonly, 
they will be `Buffer` objects, especially for binary data uploads. The code needs to handle `Buffer` objects correctly 
if you're receiving binary data.

**Important Considerations:**

* **Encoding:** Choose the appropriate encoding (`'utf8'`, `'ascii'`, `'binary'`, etc.) for your streams based on the 
  type of data you're handling. Incorrect encoding can lead to data corruption.  When in doubt with binary data, leave 
  the encoding off and deal with `Buffer` objects directly.
* **Buffer Management:** Buffers have a fixed size. If you're accumulating data in a Buffer, be mindful of the buffer's 
  capacity and avoid exceeding it.
* **String Conversion:** Always use the correct encoding when converting Buffers to strings using `.toString()`.


Okay, here's the expanded note, now including both the HTTP client-side request section and an example for each of the use cases:




# Other Use Cases of Streams in Node.js

Streams in Node.js are not just for file system operations and HTTP requests. They provide a powerful abstraction for handling data in chunks, making them useful in various other scenarios. Here are some notable examples:

**1. Data Compression/Decompression:**

The `zlib` module uses streams to compress and decompress data efficiently. You can compress files, HTTP responses, or any other data stream using gzip, deflate, or other compression algorithms.

```javascript
const zlib = require('zlib');
const {pipeline} = require('File_operations_and_stream/stream');
const fs = require('fs');

const gzip = zlib.createGzip();
const source = fs.createReadStream('input.txt');
const destination = fs.createWriteStream('input.txt.gz');

pipeline(
    source,
    gzip,
    destination,
    (err) => {
        if (err) {
            console.error('Pipeline failed.', err);
        } else {
            console.log('Pipeline succeeded.');
        }
    }
);
```

**2. Data Transformation Pipelines:**

Streams allow you to create complex data transformation pipelines, where data flows through a series of processing steps. Each step can modify or filter the data before passing it to the next step.

```javascript
const {Transform} = require('File_operations_and_stream/stream');

// Custom transform stream to uppercase data
class UppercaseTransform extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        const transformedChunk = chunk.toString().toUpperCase();
        this.push(transformedChunk);
        callback();
    }
}

// Create an UppercaseTransform instance
const uppercase = new UppercaseTransform();

// Pipe the stream to process data
process.stdin.pipe(uppercase).pipe(process.stdout);

console.log('Enter text to be uppercased (Ctrl+C to exit):');
```

**3. Handling Large Datasets:**

Streams are essential for processing large datasets that don't fit into memory. You can read data from a large file or database in chunks, process each chunk, and write the results to a destination.

```javascript
const fs = require('fs');
const {pipeline} = require('File_operations_and_stream/stream');

const readStream = fs.createReadStream('./large_data.txt', {highWaterMark: 16 * 1024}); // 16KB chunks
const writeStream = fs.createWriteStream('./processed_data.txt');

pipeline(
    readStream,
    writeStream,
    (err) => {
        if (err) {
            console.error('Pipeline failed.', err);
        } else {
            console.log('Large data processed successfully.');
        }
    }
);
```

**4. Real-time Data Processing:**

Streams enable real-time data processing, where you can process data as it arrives, without waiting for the entire dataset to be available. This is useful for applications like log analysis, monitoring systems, and data analytics.

**Simplified Example (Illustrative):**

```javascript
const {Transform} = require('File_operations_and_stream/stream');

class LogProcessor extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        const logLine = chunk.toString().trim();
        // Perform real-time analysis (e.g., detect errors)
        if (logLine.includes('ERROR')) {
            console.log('ERROR detected:', logLine);
        }
        this.push(chunk); // Pass the log line through
        callback();
    }
}

// (In a real application, you'd pipe from a log file)
process.stdin.pipe(new LogProcessor()).pipe(process.stdout);
console.log("Monitoring log stream... (Ctrl+C to exit)");
```

**5. Inter-Process Communication (IPC):**

Streams can be used for inter-process communication, allowing different processes to exchange data efficiently.

**Simplified Example (using child\_process):**

```javascript
const {spawn} = require('Performance_Enhance/child_process');

const child = spawn('ls', ['-l']); // Execute a command

child.stdout.pipe(process.stdout); // Pipe the output to the current process's stdout

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});
```

**6. Custom Protocol Implementation:**

When implementing custom network protocols, streams are helpful for handling the flow of data between clients and servers.

**Simplified Example (Basic echo server):**

```javascript
const net = require('net');

const server = net.createServer((socket) => {
    socket.pipe(socket); // Echo the data back to the client
});

server.listen(3000, () => {
    console.log('Echo server listening on port 3000');
});
```

**7. Using `http` Module for Client-Side Requests:**

When making HTTP requests with the `http` or `https` module, you can use streams to send data in the request body without loading it all into memory.

```javascript
const http = require('http');
const fs = require('fs');

const options = {
    hostname: 'example.com',
    port: 80,
    path: '/upload',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain'
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    // Process the response stream if needed
});

const fileStream = fs.createReadStream('data.txt');
fileStream.pipe(req); // Pipe the file stream to the request

req.on('error', (err) => {
    console.error('Request error:', err);
});
```

**8. Third-Party Libraries:**

Many third-party libraries leverage streams internally to handle various tasks, such as:

*   **CSV Parsing:** Libraries like `csv-parse` use streams to parse large CSV files efficiently.
*   **Image Processing:** Image processing libraries might use streams to process large images in chunks.
*   **Audio/Video Processing:** Stream-based processing is crucial for handling audio and video data in real-time.
*   **Database Interactions:** Some database drivers use streams to efficiently fetch large result sets.

(No specific example here as the use is implicit within the library)

**Key Advantages of Using Streams:**

*   **Memory Efficiency:** Streams allow you to process large datasets without loading them entirely into memory.
*   **Responsiveness:** Real-time processing is possible with streams, as data can be processed as it arrives.
*   **Composability:** Streams can be easily chained together to create complex data processing pipelines.
*   **Flexibility:** Streams can be used with various data sources and destinations, including files, network sockets, and in-memory buffers.

**In conclusion:** Streams provide a versatile and efficient way to handle data in Node.js, going beyond basic file system operations and HTTP requests. They are a fundamental tool for building scalable and responsive applications that can process large amounts of data in real-time. When approaching any problem that involves processing data, consider whether streams could provide a more efficient and manageable solution.



# References
* [Streams in Node Js | Backend Interview Series](https://www.youtube.com/watch?v=DfIfgd9TjB4)
* [ #6 - Node.js Stream & Buffer - Node.js Tutorial Bangla | Bangla Node js Tutorial ](https://www.youtube.com/watch?v=BPdRVquo5pg)