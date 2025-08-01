// import app from './app.js';
import config from './config/config.js';
import logger from './config/logger.js';
import {connectDB} from "./config/db.js";
import syncModels from './config/syncModels.js';

let server;

connectDB().then(async () => {
  const app = (await import('./app.js')).default;
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  // Sync all models after DB connection
  await syncModels();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
