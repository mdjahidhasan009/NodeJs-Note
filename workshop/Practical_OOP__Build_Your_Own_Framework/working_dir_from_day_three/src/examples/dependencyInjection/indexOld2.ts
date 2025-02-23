import "reflect-metadata";
import {singleton, container, injectable, inject} from "tsyringe";

interface ILogger {
    log(message: string): void;
}

@singleton()
class ConsoleLogger implements ILogger {
    log(message: string): void {
        console.log(message);
    }
}

const LoggerToken = Symbol("Logger");
container.register<ILogger>(LoggerToken, {
    useClass: ConsoleLogger
});

@injectable()
class ReportService {
    constructor(
        @inject(LoggerToken)
        private readonly logger: ILogger
    ) {}

    generateReport() {
        this.logger.log("Generating report...");
        for(let i = 0; i < 1000000000; i++) {}
        this.logger.log("Report generated successfully!");
    }
}

const reportService = container.resolve(ReportService);
reportService.generateReport();