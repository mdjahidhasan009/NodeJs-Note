import 'reflect-metadata';

import {type RequestHandler} from "express";
import {ROUTE_KEY} from "@/lib/decorator/decorator.keys";

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

// As we can use express's RequestHandler type, we can import it from express
// export type RequestHandler = (
//     req: Request,
//     res: Response,
//     next: NextFunction,
// ) => void | Promise<void>;

export type RouterDefinition = {
    httpMethod: HttpMethod;
    path: string;
    middleware: RequestHandler[];
    methodName: string;
}

export function Route(
    httpMethod: HttpMethod,
    path: string,
    middleware: RequestHandler[]
) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const routes: RouterDefinition[] = Reflect.getMetadata(ROUTE_KEY, target) || [];
        routes.push({
            httpMethod,
            path,
            middleware,
            methodName: propertyKey.toString()
        });
        Reflect.defineMetadata(ROUTE_KEY, routes, target);
        return descriptor;
    }
}

export const  Get = (path: string, middleware: RequestHandler[] = []) =>
    Route('get', path, middleware);

export const Post = (path: string, middleware: RequestHandler[] = []) =>
    Route('post', path, middleware);

export const Put = (path: string, middleware: RequestHandler[] = []) =>
    Route('put', path, middleware);

export const Patch = (path: string, middleware: RequestHandler[] = []) =>
    Route('patch', path, middleware);

export const Delete = (path: string, middleware: RequestHandler[] = []) =>
    Route('delete', path, middleware);