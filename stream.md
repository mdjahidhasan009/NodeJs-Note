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

### Another Version
```js
const fs = require('fs');

const readStream = fs.createReadStream('./big_text.txt');

readStream.on('data', (chunk) => {
    console.log(chunk.toString());
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('-------------------END OF CHUNK-------------------');
});
```


## Writeable Stream
> Write data to destination

```js
const fs = require('fs');
const writeStream = fs.createWriteStream('./sample.txt', 'utf8');

writeStream.write('Hello World');
writeStream.end();

writeStream.on('finish', () => {
    console.log('finished writing');
});
```

## Duplex Stream
> Read and write data

### Without Pipe
```js
const fs = require('fs');

const readStream = fs.createReadStream('./input.txt', 'utf8');
const writeStream = fs.createWriteStream('./output.txt', 'utf8');

readStream.on('data', (chunk) => {
    writeStream.write(chunk);
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


## Transform Stream
> Modify data





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

# References
* [Streams in Node Js | Backend Interview Series](https://www.youtube.com/watch?v=DfIfgd9TjB4)
* [ #6 - Node.js Stream & Buffer - Node.js Tutorial Bangla | Bangla Node js Tutorial ](https://www.youtube.com/watch?v=BPdRVquo5pg)