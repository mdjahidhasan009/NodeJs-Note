# Child Process
In Node.js child process module is used to run a system command in a separate process. It is used to create a new child
process from the parent process. The child process module provides the ability to spawn child processes in a similar way
to popen(3).

```js
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

## Ways of create child process

## `fork`

## `spawn`

## `exec`
### `execSync`

## `execFile`



**test.js**

```js
const child_process = require('Performance_Enhance/child__process/readme');

const output = child_process.execSync('node test2.js');

console.log(output.toString());
```

**test2.js**
```js
console.log('console log from test2.js');
```

```shell
$ node test.js
console log from test2.js
```


## Sources
* [ Child Process Module in Node JS | Backend Interview Series ](https://www.youtube.com/watch?v=JjOvDXe8-jQ)