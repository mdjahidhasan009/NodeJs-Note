import "reflect-metadata";
import {RequestHandler} from "express";
import {CONTROLLER_MIDDLEWARE_KEY, MIDDLEWARE_KEY} from "@/lib/decorator/decorator.keys";

export function Use(middleware: RequestHandler | RequestHandler[]) {
    return function (target: any, propertyKey?: string | symbol) {
        const middlewares = Array.isArray(middleware) ? middleware : [middleware];

        // method level middleware
        if(propertyKey && typeof propertyKey === 'string') {
            const existingMiddlewares = Reflect.getMetadata(MIDDLEWARE_KEY, target, propertyKey) || [];
            const combinedMiddlewares = [...existingMiddlewares, ...middlewares];
            Reflect.defineMetadata(CONTROLLER_MIDDLEWARE_KEY, combinedMiddlewares, target, propertyKey);
            return;
        }

        // Class level middleware
        const existingMiddlewares = Reflect.getMetadata(CONTROLLER_MIDDLEWARE_KEY, target) || [];
        const combinedMiddlewares = [...existingMiddlewares, ...middlewares];
        Reflect.defineMetadata(CONTROLLER_MIDDLEWARE_KEY, combinedMiddlewares, target);
    }
}

export const Auth = () => Use((req, res, next) => {
    console.log('Auth middleware');
    next();
});

export const Permission = (permission: string) => Use((req, res, next) => {
    console.log('Permission middleware:', permission);
    next();
});