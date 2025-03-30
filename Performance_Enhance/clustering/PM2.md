```shell
npm install pm2 -g` # Install PM2 globally
pm2 start test.js -i 0 # Start test.js in cluster mode and let PM2 decide the number of instances to run
pm2 list # List all running processes
pm2 show test # Show details of a specific process
pm2 monit # Monitor CPU and memory usage of all running processes
pm2 logs # Display logs of all processes
pm2 delete test # Stop and delete a process
```

While we are using `PM2` we do not need to write clustering code in our application. `PM2` will handle it for us. We can
also use `PM2` to start our application in production mode. `PM2` will automatically restart our application if it
crashes. It will also keep a log of our application's output. We can also use `PM2` to monitor our application's CPU and 
memory usage.



# References
- [Node JS: Advanced Concepts](https://www.udemy.com/course/advanced-node-for-developers/)