# `crypto` module in Node.js
`crypto` is a built-in module in Node.js that provides cryptographic functionality that includes a set of wrappers for
OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions. It is used to perform various cryptographic 
operations such as hashing, encryption, and decryption.

It is important to note that the `crypto` module is not a replacement for a full-fledged cryptographic library, and it 
should not be used for security-critical applications without a thorough understanding of the underlying cryptographic
principles.

It is I/O bound, so it is not recommended to use it in worker threads. It is recommended to use it in the main thread.

