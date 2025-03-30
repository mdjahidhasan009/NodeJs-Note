# Event Emitter in Node.js

In Node.js, the `EventEmitter` class is used to handle events. It is a class that is used to bind events and event
listeners. The `EventEmitter` class is defined in the `events` module. The `EventEmitter` class is used to create custom 
events and bind them to event listeners.

```js
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('event', () => {
    console.log('an event occurred!');
});

myEmitter.emit('event');

//list of all events
console.log(myEmitter.eventNames());
```

```shell
$ node test.js
an event occurred!
[ 'event' ]
```


```js
/* Polyfill indexOf */
var indexOf;

if(typeof Array.prototype.indexOf === 'function') {
    indexOf = function(haystack, needle) {
        return haystack.indexOf(needle);
    };
} else {
    indexOf = function(haystack, needle) {
        var i = 0, length = haystack.length, idx = -1, found = false;

        while(i < length && !found) {
            if(haystack[i] === needle) {
                idx = i;
                found = true;
            }
            i++;
        }

        return idx;
    };
}

/* Polyfill EventEmitter */
var EventEmitter = function() {
    this.events = {};
};

EventEmitter.prototype.on = function(event, listener) {
    if(typeof this.events[event] !== 'object') {
        this.events[event] = [];
    }

    this.events[event].push(listener);
};

EventEmitter.prototype.removeListener = function(event, listener) {
    var idx;

    if(typeof this.events[event] === 'object') {
        idx = indexOf(this.events[event], listener);

        if(idx > -1) {
            this.events[event].splice(idx, 1);
        }
    }
};

EventEmitter.prototype.emit = function(event) {
    var i, listeners, length, args = [].slice.call(arguments, 1);

    if(typeof this.events[event] === 'object') {
        listeners = this.events[event].slice();
        length = listeners.length;

        for(i = 0; i < length; i++) {
            listeners[i].apply(this, args);
        }
    }
};

EventEmitter.prototype.once = function(event, listener) {
    this.on(event, function g() {
        this.removeListener(event, g);
        listener.apply(this, arguments);
    });
};

EventEmitter.prototype.listeners = function(event) {
    return this.events[event];
};

var myEmitter = new EventEmitter();
myEmitter.on('event1', function() {
    console.log('Event 1 occurred!');
});

myEmitter.on('event2', function() {
    console.log('Event 2 occurred!');
});

myEmitter.on('event2', function() {
    console.log('Second listener for event 2 occurred!');
});

myEmitter.on('event3', function() {
    console.log('Event 3 occurred!');
});

myEmitter.emit('event1');
myEmitter.emit('event2');
myEmitter.emit('event3');
console.log(myEmitter.listeners('event2'));
```

```shell
$ node test.js
Event 1 occurred!
Event 2 occurred!
Second listener for event 2 occurred!
Event 3 occurred!
[ [Function (anonymous)], [Function (anonymous)] ]
```

## Event Queue
The event queue is a data structure that stores events that are waiting to be processed. When an event is emitted, it is 
added to the event queue. The event loop processes the events in the queue one by one. The event loop manage this by 
iterating over the queue and executing the event listeners for each event in the queue. We do not need explicitly 
manage the event queue, as the event loop does this for us.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
myEmitter.on('event', () => {
    console.log('an event occurred!');
});

myEmitter.emit('event');
console.log('Event emitted');
```

```shell

### Reference
* [ Polyfill Of Event Emitter | Backend Interview Series ](https://www.youtube.com/watch?v=xpCeM5ygQxQ)