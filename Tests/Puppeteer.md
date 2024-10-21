# Puppeteer

Puppeteer is a Node library that provides a high-level API to control headless Chrome or Chromium over the DevTools Protocol.
It can also be configured to use full (non-headless) Chrome or Chromium. Puppeteer runs headless by default but can be configured
to run full (non-headless) Chrome or Chromium.

## Behind the Scenes

Puppeteer communicates with the browser using the DevTools Protocol. This protocol allows tools like Puppeteer to control the
browser in a programmatic way. The DevTools Protocol is based on the Chrome DevTools Protocol, which is widely supported by all
major browsers.

Jest runs in Node.js and converts the function to a string before sending it to Puppeteer to run in its virtual browser.
The result is then returned back to Jest.

You can see the function to string conversion in the browser console by running the following code:

```javascript
const func = () => {
    console.log('Hello World');
}

console.log(func.toString());
```

**Output**:
```javascript
() => {
    console.log('Hello World');
}
```

## Note on Puppeteer and String Conversion in `page.evaluate`

### Context

When using Puppeteer, the `page.evaluate` method allows you to run JavaScript code in the context of the page being controlled by
Puppeteer. One important aspect to understand is how variables are handled within this context.

### Correct Implementation

```javascript
get(path) {
    return this.page.evaluate((_path) => {
        return fetch(_path, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
    }, path);
}
```

#### Explanation of String Conversion in Puppeteer

1. **Passing Variables to `page.evaluate`**:
    - In Puppeteer, when you use `page.evaluate`, you can pass variables as additional arguments after the function definition.
      These variables are automatically serialized to strings and made available within the browser context. No other **scope**,
      **variable**, or **function** is available in the browser context.
    - In the correct implementation, `_path` is used as a parameter in the inner function. The value of `path` is passed in as
      an argument to `evaluate`, allowing it to be safely used within the browser context.

2. **String Conversion and Scope**:
    - The key point is that the variable passed (in this case, `path`) is converted into a string when it is sent to the browser
      context. Puppeteer serializes the arguments so that they can be used within the evaluated function.
    - This means `_path` is treated as a string literal within the `evaluate` context, mitigating issues that arise from trying
      to access a variable defined in an outer scope.

3. **Avoiding Reference Errors**:
    - By converting the path into a string and using it as a parameter in the evaluated function, the implementation avoids
      `ReferenceError` problems that occur when a variable is not defined in the same scope.
    - This serialization ensures that the correct string representation is used for the fetch request, preventing potential errors
      from undefined variables.

### Wrong Implementation

```javascript
const result = await page.evaluate(() => {
    const path = '/api/blogs'; // Convert path to string
    return fetch(path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());
});
```

#### Issues with the Wrong Code

- **Scope of Variables**:
    - In the wrong implementation, the variable `path` is defined within the scope of the `evaluate` function. This means it is
      not accessible when `fetch` is called, resulting in a `ReferenceError`.

### Adding Multiple Arguments to `page.evaluate`

You can pass multiple arguments to `page.evaluate` like this:

```javascript
const result = await page.evaluate((path) => {
    //...
}, path); //...arg (path) will be passed to the function
```

The `...arg` will be passed to the function as arguments, so you can pass multiple arguments to the function.

### Summary

In the correct implementation, Puppeteer converts the path variable into a string when it is passed to the `page.evaluate` function.
This conversion allows the path to be used safely within the browser context, ensuring that the fetch request operates with the
intended URL without encountering reference errors. This mechanism is essential for maintaining clean and effective communication
between the Node.js environment and the browser context managed by Puppeteer.

# References
* [Node JS: Advanced Concepts](https://www.udemy.com/course/advanced-node-for-developers/)
