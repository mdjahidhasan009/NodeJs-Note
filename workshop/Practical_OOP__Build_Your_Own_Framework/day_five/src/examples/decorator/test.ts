////TODO: have to run this by myself so that I can understand it better

import 'reflect-metadata';

const RequiredKey = 'required';

function Required(target: any, propertyKey: string, parameterIndex: number) {
    const existingRequiredParameters: number[] = Reflect.getOwnMetadata('required', target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(
        RequiredKey,
        existingRequiredParameters,
        target,
        propertyKey
    );
}

function Validate(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const requiredParameters =
            Reflect.getOwnMetadata(RequiredKey, target, propertyKey) || [];
        for (const index of requiredParameters) {
            if (args[index] === undefined) {
                throw new Error(
                    `Missing required parameter at index ${index} for ${propertyKey}`
                );
            }
        }

        return method.apply(this, args);
    };
}

class User {
    @Validate
    createUser(name: string, @Required email?: string) {
        return { name, email };
    }
}

const user = new User();
user.createUser('John', 'john@example.com');