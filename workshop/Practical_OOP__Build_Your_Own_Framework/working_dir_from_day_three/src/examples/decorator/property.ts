function MinLength(min: number = 3) {
    return function (target: any, propertyKey: string) {
        let value: string;
        Object.defineProperty(target, propertyKey, {
            get() {
                return value;
            },
            set(newValue: string) {
                if (newValue.length < min) {
                    throw new Error(`${propertyKey} must be at least ${min} characters`);
                }
                value = newValue;
            },
        });
    };
}

function Email(target: any, propertyKey: string) {
    let value: string;
    Object.defineProperty(target, propertyKey, {
        get() {
            return value;
        },
        set(newValue: string) {
            if (!newValue.includes('@')) {
                throw new Error(`${propertyKey} must be a valid email address`);
            }
            value = newValue;
        },
    });
}

class User {
    @MinLength(3)
    name: string;

    @Email
    email: string;

    age: number;

    constructor(name: string, email: string, age: number) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
}

const u = new User('Joe', 'johnexample.com', 0);
console.log(u.name, u.email, u.age);