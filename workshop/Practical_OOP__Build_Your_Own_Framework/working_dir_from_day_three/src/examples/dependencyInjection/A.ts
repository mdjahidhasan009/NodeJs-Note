import {delay, inject, injectable} from "tsyringe";
import {B} from "@/examples/dependencyInjection/B";

@injectable()
export class A {
    constructor(
        @inject(delay(() => B))
        private readonly b: B
    ) {
        console.log('A created');
    }
}