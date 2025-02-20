class UserProfile2 {
    protected name: string;
    protected price: number;

    constructor(name: string) {
        this.name = name;
        this.price = 100;
    }

    get myName() {
        const name = this.name.toUpperCase();
        return `$$$___${name}___$$$`;
    }

    set myName(name: string) {
        if (name.toLocaleLowerCase().startsWith('sh')) {
            throw new Error('SH is blocked from our system');
        }
        this.name = name;
    }

    get currentPrice() {
        return `$${this.price}`;
    }
}

// Access Modifiers
// public, private, protected

const user = new UserProfile2('John Doe');
console.log(user)
// console.log(user?._name);
user.myName = 'Rasel';
console.log(user.myName);
console.log(user.currentPrice);

// class UserProfile2 {
//     // Properties (data)
//     private ssn: string; // Sensitive data
//     public readonly userId: string; // Immutable once set
//     private _email: string;
//
//     // Constructor (initialize objects)
//     constructor(ssn: string, public name: string) {
//         this.ssn = ssn;
//         this.userId = this.generateUserId();
//         this._email = '';
//     }
//
//     // Method (action)
//     public describe(): string {
//         return `${this.name} (ID: ${this.userId})`;
//     }
//
//     // Private helper method (hidden logic)
//     private generateUserId(): string {
//         return `${this.name}-${Math.floor(Math.random() * 1000)}`;
//     }
//
//     // Getter/Setter (controlled access)
//     get email(): string {
//         return this._email;
//     }
//
//     set email(newEmail: string) {
//         if (newEmail.includes('@')) {
//             this._email = newEmail;
//         } else {
//             throw new Error('Invalid email format');
//         }
//     }
//
//     // Static method (class-level utility)
//     static validateName(name: string): boolean {
//         return name.length >= 2 && name.toLocaleLowerCase().startsWith('sh');
//     }
// }
//
// // Usage
// const user2 = new UserProfile2('123-45-6789', 'Alice');
// user2.email = 'alice@example.com';
// console.log(user2.describe()); // "Alice (ID: Alice-742)"
// console.log(UserProfile2.validateName('Ashikue'));


//2:42:00