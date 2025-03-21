# Stream
## Readable Stream
> Read data from source

```js
const fs = require('fs');
const readStream = fs.createReadStream('./sample.txt', 'utf8');

let content = '';

readStream.on('data', (chunk) => {
    console.log(chunk);
    content += chunk;
});

readStream.on('end', () => {
    console.log('finished reading');
    console.log(content);
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

```js
const fs = require('fs');

const readStream = fs.createReadStream('./input.txt', 'utf8');
const writeStream = fs.createWriteStream('./output.txt', 'utf8');

readStream.pipe(writeStream);
```

## Transform Stream
> Modify data


# References
* [Streams in Node Js | Backend Interview Series](https://www.youtube.com/watch?v=DfIfgd9TjB4)