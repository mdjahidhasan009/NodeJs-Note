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


class MathOperations {
    private operationCount: number = 0;
    private lastOperation: string = '';

    constructor(private name: string = 'Default Calculator') {}

    @Performance
    multiply(a: number, b: number): number {
        this.operationCount++;
        this.lastOperation = 'multiply';
        // simulate some processing time
        for(let i = 0; i < 1000000; i++) {}
        return a * b;
    }

    @Performance
    factorial(n: number): number {
        this.operationCount++;
        this.lastOperation = 'factorial';
        if( n <= 1) return 1;
        return n * this.factorial(n - 1);
    }
}

const math = new MathOperations('Scientific Calculator');
math.multiply(23, 45);
math.factorial(5);