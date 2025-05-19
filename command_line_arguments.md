In NodeJS, you can access command-line arguments passed to your script using the global `process` object, specifically
the `process.argv` array. This array contains:

*   `process.argv[0]`: The absolute path to the Node.js executable.
*   `process.argv[1]`: The absolute path to the script being executed (your `index.js` file in the example).
*   `process.argv[2]` onwards: The arguments you provide after the script name when running the command.

**Example:**

```javascript
// index.js

let arguments = process.argv;

console.log("Full arguments array:", arguments);

//Accessing individual arguments:
const argument1 = arguments[2];
const argument2 = arguments[3];

console.log("Argument 1:", argument1);
console.log("Argument 2:", argument2);
```

**Running the script:**

```bash
node index.js hello world 123
```

**Output:**

```
Full arguments array: [
  '/usr/local/bin/node', // Example path
  '/path/to/your/index.js', // Example path
  'hello',
  'world',
  '123'
]
Argument 1: hello
Argument 2: world
```

**Practical Example: A Simple Calculator**

Let's create a script that takes two numbers as command-line arguments and performs an operation on them:

```javascript
// calculator.js

let arguments = process.argv;

// Check if enough arguments are provided
if (arguments.length < 5) {
  console.error("Usage: node calculator.js <number1> <operation> <number2>");
  process.exit(1); // Exit with an error code
}

const num1 = parseFloat(arguments[2]);
const operation = arguments[3];
const num2 = parseFloat(arguments[4]);

// Validate inputs:
if (isNaN(num1) || isNaN(num2)) {
  console.error("Error:  Number1 and Number2 must be numbers.");
  process.exit(1);
}

let result;

switch (operation) {
  case "+":
    result = num1 + num2;
    break;
  case "-":
    result = num1 - num2;
    break;
  case "*":
    result = num1 * num2;
    break;
  case "/":
    if (num2 === 0) {
      console.error("Error: Division by zero is not allowed.");
      process.exit(1);
    }
    result = num1 / num2;
    break;
  default:
    console.error("Error: Invalid operation.  Use +, -, *, or /");
    process.exit(1);
}

console.log("Result:", result);
```

**Running the script:**

```bash
node calculator.js 10 + 5
```

**Output:**

```
Result: 15
```

**Important Considerations:**

*   **Error Handling:** Always check if enough arguments are provided and validate their types.  Using `process.exit(1)`
    is a standard way to indicate an error to the operating system.
*   **Data Type Conversion:**  Command-line arguments are always strings. You'll often need to convert them to numbers 
    (e.g., using `parseFloat` or `parseInt`) or other data types as needed.
*   **Argument Parsing Libraries:** For more complex command-line applications, consider using libraries like `yargs` or
    `commander` to simplify argument parsing, handle options/flags, and generate help messages.  These libraries greatly
    improve the user experience.

**Example with `yargs`:**

```javascript
// advanced-calculator.js
const yargs = require('yargs');

const argv = yargs
  .option('num1', {
    alias: 'n1',
    describe: 'The first number',
    type: 'number',
    demandOption: true // Required
  })
  .option('num2', {
    alias: 'n2',
    describe: 'The second number',
    type: 'number',
    demandOption: true
  })
  .option('operation', {
    alias: 'op',
    describe: 'The operation to perform (+, -, *, /)',
    type: 'string',
    demandOption: true,
    choices: ['+', '-', '*', '/']
  })
  .help()
  .alias('help', 'h')
  .argv;

const num1 = argv.num1;
const num2 = argv.num2;
const operation = argv.operation;

let result;

switch (operation) {
  case "+":
    result = num1 + num2;
    break;
  case "-":
    result = num1 - num2;
  case "*":
    result = num1 * num2;
    break;
  case "/":
    if (num2 === 0) {
      console.error("Error: Division by zero is not allowed.");
      process.exit(1);
    }
    result = num1 / num2;
    break;
}

console.log("Result:", result);
```

**Running with `yargs`:**

```bash
node advanced-calculator.js --num1 10 --operation + --num2 5
# or
node advanced-calculator.js -n1 10 -op + -n2 5
```

The `yargs` library provides a much cleaner and more robust way to handle command-line arguments, making your scripts 
easier to use and maintain. It automatically generates help messages based on your defined options.
