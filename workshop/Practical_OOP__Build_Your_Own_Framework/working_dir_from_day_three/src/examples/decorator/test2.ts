function Performance(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    // console.log('performance decorator called');
    // console.log('target:', target);
    // console.log('target:', Object.getOwnPropertyNames(target));
    // console.log('propertyKey:', propertyKey);
    // console.log('propertyDescriptor:', propertyDescriptor);

    const originalMethod = propertyDescriptor.value;

    // Must not use arrow function here, because we need to access the 'this' keyword
    // this also will block the original method from being called only this will be called
    propertyDescriptor.value = function(...args: any[]) {
        // this will log only after it get called from the class instance
        console.log(`\n =============== Performance decorator called for ${propertyKey} method`);
        const start = performance.now();
        // now we call the original method
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        const duration = (end - start).toFixed(2);

        console.log('Result', result);
        console.log('Execution time:', duration, 'ms');
        console.log('=============== Performance decorator ended ===============\n');

        return result;
    }
}

class Person {
    constructor(private name: string, private age: number) {}

    @Performance
    sayHello() {
        console.log('I am the actual sayHello method');
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }

    @Performance
    longJob() {
        console.log('Starting a long job...');
        for (let i = 0; i < 1000000; i++) {}
        console.log('Long job finished.');
    }
}

const person = new Person('John Doe', 30);
person.sayHello();
person.longJob();

