import "reflect-metadata";
import {Application, RequestHandler, Router} from "express";
import {CONTROLLER_KEY, CONTROLLER_MIDDLEWARE_KEY, MIDDLEWARE_KEY, ROUTE_KEY} from "@/lib/decorator/decorator.keys";
import {Controller} from "@/lib/decorator";
import {RouterDefinition} from "@/lib/decorator/router.decorator";
import {container} from "tsyringe";

type Constructor = new (...args: any[]) => {};

type ControllerMetadata = {
  baseRoute: string;
  routes: RouterDefinition[];
  middlewares: RequestHandler[];
}

export function registerControllers(
    app: Application,
    controllers: Constructor[]
) {
  controllers.forEach((Controller) => {
    // resolve dependency injection here
    const controllerInstance = container.resolve(Controller);

    // Get controller metadata
    const controllerMetadata: ControllerMetadata = {
      baseRoute: Reflect.getMetadata(CONTROLLER_KEY, Controller),
      routes: Reflect.getMetadata(ROUTE_KEY, Controller.prototype) as RouterDefinition[],
      middlewares: Reflect.getMetadata(CONTROLLER_MIDDLEWARE_KEY, Controller) as RequestHandler[] || []
    }

    if(!controllerMetadata.baseRoute) {
      throw new Error(`[registerControllers] Base path is not defined for controller ${Controller.name}`);
    }

    if(!controllerMetadata.routes.length) {
        throw new Error(`[registerControllers] No routes defined for controller ${Controller.name}`);
    }

    const router: Router = Router();

    // Apply controller level middlewares
    if(controllerMetadata.middlewares.length > 0) {
      router.use(controllerMetadata.middlewares);
      console.log('Controller middleware applied');
    }

    // Handle individual routes
    controllerMetadata.routes.forEach((route) => {
      // Check if the method exits in the controller instance
      if (!(route.methodName in controllerInstance)) {
        throw new Error(
            `[registerControllers] Method ${route.methodName} is not defined in controller ${Controller.name}`
        )
      }
      const middlewares = Reflect.getMetadata(
          MIDDLEWARE_KEY,
          Controller.prototype,
          route.methodName
      ) || [];

      const handler = (controllerInstance as any)[route.methodName].bind(controllerInstance);
      router[route.httpMethod](
          route.path,
          [...middlewares],
          handler
      );
    })

    app.use(controllerMetadata.baseRoute, router);
  });
}