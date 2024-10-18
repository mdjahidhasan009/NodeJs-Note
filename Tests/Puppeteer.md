# Puppeteer
Puppeteer is a Node library which provides a high-level API to control headless Chrome or Chromium over the DevTools 
Protocol. It can also be configured to use full (non-headless) Chrome or Chromium. Puppeteer runs headless by default,
but can be configured to run full (non-headless) Chrome or Chromium.

## Behind the scenes
Puppeteer communicates with the browser using the DevTools Protocol. This protocol allows for tools like Puppeteer to
control the browser in a programmatic way. The DevTools Protocol is based on the Chrome DevTools Protocol, which is
widely supported by all major browsers. 

Jest in run in nodejs, it converts the function to string then it send it to puppeteer to run in it's virtual browser
and then it returns the result back to jest.

We can see the function to string conversion in browser console by running the following code:
```javascript
const func = () => {
    console.log('Hello World');
}

console.log(func.toString());
```
**Output** <br/>
```javascript
() => {
    console.log('Hello World');
}
```