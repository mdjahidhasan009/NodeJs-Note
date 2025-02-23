function Capitalize(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalGetter = descriptor.get;
    descriptor.get = function () {
        const value = originalGetter?.call(this);
        return value.toUpperCase();
    };
}

class Person {
    private _name: string = 'this is a test string that should be capitalized';

    @Capitalize
    get name() {
        return this._name;
    }
}

const person = new Person();
console.log(person.name);