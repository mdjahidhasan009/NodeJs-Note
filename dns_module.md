# The `dns` Module in Node.js: Domain Name Resolution

The `dns` module in Node.js provides functionality for performing Domain Name System (DNS) lookups. DNS is a 
hierarchical and decentralized naming system for computers, services, or other resources connected to the internet or a 
private network. Its primary function is to translate human-readable domain names (e.g., `google.com`) into IP addresses
(e.g., `142.250.185.142`), which are used by computers to communicate with each other.

**Key Method: `dns.lookup()`**

The `dns.lookup()` method is a fundamental function in the `dns` module. It is used to resolve a domain name (hostname)
into its corresponding IP address.

*   **`dns.lookup(hostname, options, callback)`**

    *   **`hostname` (string):** The domain name you want to resolve (e.g., `'google.com'`, `'example.org'`).
    *   **`options` (object, optional):** An object that can contain the following properties:
        *   `family` (number, optional): The address family to use when resolving the hostname. Valid values are `4` (for IPv4 addresses) and `6` (for IPv6 addresses). If not specified, both IPv4 and IPv6 addresses are returned.
        *   `hints` (number, optional): One or more `dns.ADDRINFO_*` flags that influence the type of records returned.  See the Node.js documentation for details (e.g., `dns.ADDRINFO_V4FIRST` to prefer IPv4 addresses).
        *   `all` (boolean, optional): When `true`, the callback will be called with an array of all resolved addresses. Otherwise, the callback will be called with a single address.  Defaults to `false`.

    *   **`callback(err, address, family)` (function):** A callback function that is called when the lookup is complete.
        *   `err` (Error | null): An error object if the lookup failed, or `null` if it succeeded.
        *   `address` (string | string[]): The resolved IP address (or an array of IP addresses if `options.all` is `true`).
        *   `family` (number): The address family of the resolved address (either `4` or `6`).

**Example:**

```javascript
const dns = require('dns');

dns.lookup('google.com', (err, address, family) => {
  if (err) {
    console.error('Error:', err);
    return;
  }

  console.log('Address:', address);  // e.g., Address: 142.250.185.142
  console.log('Family:', family);    // e.g., Family: 4 (IPv4)
});

dns.lookup('google.com', { family: 6 }, (err, address, family) => {
  if (err) {
    console.error('Error (IPv6):', err);
    return;
  }

  console.log('Address (IPv6):', address);  // e.g., Address (IPv6): 2607:f8b0:4004:808::200e
  console.log('Family (IPv6):', family);    // e.g., Family (IPv6): 6
});

dns.lookup('google.com', { all: true }, (err, addresses) => {
    if (err) {
      console.error('Error (all):', err);
      return;
    }

    console.log('Addresses (all):', addresses);
  });
```

**Important Notes:**

*   **Operating System Resolution:**  `dns.lookup()` uses the operating system's underlying DNS resolution mechanisms. This means that it is affected by settings like your `/etc/hosts` file and your system's configured DNS servers.
*   **Asynchronous:** The `dns.lookup()` method is asynchronous; it doesn't block the Node.js event loop.
*   **Error Handling:** Always check for errors in the callback function. DNS lookups can fail for various reasons (e.g., invalid hostname, network connectivity issues).
*   **`dns.resolve()` vs. `dns.lookup()`:** The `dns` module also provides methods like `dns.resolve()`, `dns.resolve4()`, and `dns.resolve6()`. These methods use a different DNS resolution mechanism that directly queries DNS servers and provides more control over the types of records returned.  However, they are generally less performant and are less influenced by system configurations. `dns.lookup()` is usually preferred for most common use cases.

**Use Cases:**

*   Resolving domain names before making network connections.
*   Checking the IP address of a server.
*   Implementing custom DNS resolution logic.

