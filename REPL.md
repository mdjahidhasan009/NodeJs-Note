# REPL : Read, Evaluate, Print, Loop in Node.js

* **Read**: Read user's input, parses the input into JavaScript data-structure and stores in memory.
* **Eval**: Takes and evaluates the data structure.
* **Print**: Prints the result.
* **Loop**: Loops the above command until user press `ctrl-c` twice.

#### JS Expression
```shell
$ node
Welcome to Node.js v20.15.1.
Type ".help" for more information.
> 3 + 3
6
> 10/2
5
> 9-5
4
> 5 + (5+5) -5
10
> .exit
```

#### Variable
```shell
$ node 
Welcome to Node.js v20.15.1.
Type ".help" for more information.
> var a = 'Hello';
undefined
> a
'Hello'
> var b = ' there'
undefined
> b
' there'
> console.log(a+b);
Hello there
undefined
> .exit
```

#### Multi-line Code
```shell
$ node 
Welcome to Node.js v20.15.1.
Type ".help" for more information.
> var x = 0;
undefined
> x
0
> do
... { 
...   x++;
...   console.log(`my x value is ${x}`);
... } while(x < 5);
my x value is 1
my x value is 2
my x value is 3
my x value is 4
my x value is 5
undefined
> .exit
```

#### Use (_) to get the last result
```shell
$ node
Welcome to Node.js v20.15.1.
Type ".help" for more information.
> 5+5
10
> 10+5
15
> 15+5
20
> _
20
> _+5
25
> _+5
30
> .exit
```

#### Editor Mode
```shell
$ node
Welcome to Node.js v20.15.1.
Type ".help" for more information.
> .editor
// Entering editor mode (Ctrl+D to finish, Ctrl+C to cancel)
const name = (myname) => { console.log(`my name is ${myname}`); }

name('this is a string');

my name is this is a string
undefined
> .exit
```

## Reference
* [Node.JS #4: 📑 Complete REPL in NodeJS | READ, Eval, Print & Loop in NodeJS in Hindi in 2020](https://www.youtube.com/watch?v=uJOsl4x7pAo)