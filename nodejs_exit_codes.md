# Node.js Exit Codes

*   **Uncaught Fatal Exception:**
    *   **Occurrence:**
        *   **Unhandled Promise Rejection:** A Promise rejects, and there's no `.catch()` handler.
        *   **Synchronous Errors:** An error is thrown within a synchronous code block without a `try...catch` block.
        *   **Errors in Event Handlers:** An error occurs inside an event handler and is not caught.

    *   **How to Catch:**

        1.  **`try...catch` (for Synchronous Errors):**
            ```javascript
            try {
              // Code that might throw an error synchronously
              const result = someFunctionThatMightFail();
              console.log('Result:', result);
            } catch (error) {
              console.error('Caught Error:', error);
              // Handle the error (e.g., log it, attempt recovery)
            }
            ```

        2.  **`.catch()` (for Promises):**
            ```javascript
            const myPromise = someAsyncFunction();

            myPromise
              .then((result) => {
                console.log('Promise resolved:', result);
              })
              .catch((error) => {
                console.error('Promise rejected:', error);
                // Handle the error
              });
            ```

        3.  **`process.on('unhandledRejection')` (for Unhandled Promise Rejections):**
              ```javascript
              process.on('unhandledRejection', (reason, promise) => {
                  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
                  // Application specific logging, throwing an error, or other logic here
              });

              Promise.reject('oh no'); // Example of an unhandled rejection
              ```

        4.  **`process.on('uncaughtException')` (Last Resort, Global Handler):**
            ```javascript
            process.on('uncaughtException', (err) => {
              console.error('Uncaught Exception:', err);
              // Attempt cleanup (carefully - process state might be corrupted)
              // Log the error
              // Optionally exit the process (usually necessary)
              process.exit(1);  // Exit with a non-zero code
            });
            ```

    *   **Catchability:**  Most uncaught exceptions *can* be caught using `try...catch`, `.catch()`, 
        `process.on('unhandledRejection')`, or `process.on('uncaughtException')`. The `uncaughtException` handler is a 
        last resort; preventing uncaught exceptions through proactive error handling is always preferred.

*   **Unused:**
    This entry likely represents a reserved exit code that was never assigned a specific meaning or function in Node.js.
    It might have been intended for future use or may simply be a remnant of an earlier design. Encountering this exit 
    code in practice is highly unlikely under normal circumstances.
    *   **Catchability:** Not applicable, as this code shouldn't occur under normal circumstances. It is not designed to
        be "caught." You cannot handle this exit code, because it shouldn't happen in the first place.

*   **Fatal Error:**

    *   **Occurrence:**
        *   **Out of Memory (OOM):** Your application attempts to allocate more memory than is available.
        *   **Stack Overflow:** Recursive function calls consume all available stack space.
        *   **V8 Engine Errors:** Internal errors within the V8 JavaScript engine.

    *   **How to Catch:** Prevention is key!
        1.  **Memory Management:**  Optimize memory usage, avoid memory leaks, and use efficient data structures.
        2.  **Recursive Function Limits:**  Avoid unbounded recursion. Set limits and use iterative approaches when 
            possible.
        3.  **Resource Monitoring:**  Monitor your application's memory usage.  Tools like `heapdump` can help identify 
            memory leaks.

    *   **Catchability:** *Generally uncatchable directly within your code.* When a fatal error occurs, the Node.js 
        runtime is in a compromised state, and attempting to catch and recover from the error is usually not possible or
        advisable. Instead, focus on prevention and using a process manager for recovery.

*   **Internal Exception Handler Run-time Failure:**
    *   **Occurrence:** An error is thrown within the `uncaughtException` handler (or `unhandledRejection` handler), 
        preventing it from completing successfully.

    *   **How to Catch:** (Very tricky, and often unrecoverable).

        1.  **Robust Handler:** Make sure your `uncaughtException` and `unhandledRejection` handlers are as simple and 
            robust as possible. *Avoid throwing errors within the handlers themselves!*
        2.  **Logging:** Prioritize logging within the handler.
        3.  **Minimal Logic:**  Keep the handler's logic to the absolute minimum necessary to log the error and possibly
            attempt a graceful shutdown.

    *   **Catchability:** Extremely difficult to catch or recover from. Because it represents a failure during the error 
        handling process itself, it implies a deeply corrupted state. Prevention is the only real solution – ensure your
        exception handlers are as bulletproof as possible.

*   **Internal JavaScript Evaluation Failure:**
    *   **Occurrence:**
        *   **Invalid `eval()` Usage:** Attempting to evaluate syntactically invalid JavaScript code using `eval()`. 
            (Avoid `eval()` whenever possible!)
        *   **Corrupted Code:** In rare cases, the code loaded into the JavaScript engine may be corrupted.
        *   **V8 Engine Issues:** Bugs within the V8 JavaScript engine itself (rare, but possible).

    *   **How to Catch:**

        1.  **Avoid `eval()`:**  `eval()` is generally discouraged due to security risks and performance issues. Use 
            safer alternatives.
        2.  **Code Validation:** If you must use `eval()`, validate the code thoroughly before attempting to evaluate 
            it.
        3.  **Error Handling:** Wrap `eval()` in a `try...catch` block:

            ```javascript
            try {
              const codeToEvaluate = "2 + 2"; // Or some dynamically generated code
              const result = eval(codeToEvaluate);
              console.log('Result:', result);
            } catch (error) {
              console.error('Eval Error:', error);
              // Handle the error
            }
            ```

    *   **Catchability:** `try...catch` can catch errors resulting from invalid `eval()` usage. However, if the failure
        originates from a deeper V8 engine problem or corruption, it may not be catchable, and the process might 
        terminate abruptly.

**Key Considerations:**

*   Error handling is paramount in Node.js.
*   Avoid `eval()` unless absolutely necessary.
*   Use process managers for auto-restarts.
*   Logging is your friend. Log everything!
*   The `uncaughtException` and `unhandledRejection` handlers are *last resorts*. They signal that your application is 
    in a potentially unstable state. Ideally, you should catch errors closer to their source.
*   "Uncatchable" doesn't mean you ignore it! It means prevention and external recovery mechanisms (like process 
    managers) are crucial.
