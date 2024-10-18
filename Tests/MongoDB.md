# MongoDB
In we import mongodb model inside test suite it will not work as jest create it's own node environment do not execute 
our server code nor create database connection. so we need to mock the mongodb model. We can do this by creating 
a __mocks__ folder in the root of our project and creating a file with the same name as the module we want to mock. In 
this case we want to mock the mongodb model so we create a file called mongodb.js inside the __mocks__ folder. Inside 
this file we can create a mock model that we can use in our test suite.

```javascript