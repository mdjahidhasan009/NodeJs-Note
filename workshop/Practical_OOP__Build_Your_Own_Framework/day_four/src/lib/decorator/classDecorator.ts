import 'reflect-metadata';

type Constructor = new (...args: any[]) => {};

// function Log(constructor: Function) {
//     console.log(`Hello ${constructor.name}`)
// }
//
// @Log
// class User {
//     constructor(private name: string) {}
// }

//By default, decorator can not take argument, but we can use a factory function to pass argument to decorator
function Log(message: string) {
    return function (constructor: Constructor) {
        console.log(`${message} ${constructor.name}`);
    }
}

@Log('Hello')
class User {
    constructor(private name: string) {}
}

const ControllerKey = Symbol('Controller');

function Controller(basePath: string = '/') {
    return function (constructor: Function){
        Reflect.defineMetadata(ControllerKey, basePath, constructor); ////TODO: have to research more on defineMetadata
    }
}

@Controller('/users')
class UserController {
    constructor() {}
}

@Controller('/posts')
class PostController {
    constructor() {}
}

const data = [UserController, PostController].forEach((controller) => {
    const basePath = Reflect.getMetadata(ControllerKey, controller);
    console.log(`Controller ${controller.name} is at ${basePath}`);
});