import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import config from './config.js';
import logger from './logger.js';

let sequelize;

const connectDB = async () => {
  if (config.db.type === 'mongodb') {
    try {
      await mongoose.connect(config.mongoose.url, config.mongoose.options);
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('Unable to connect to MongoDB:', error);
      process.exit(1);
    }
  } else if (config.db.type === 'mysql') {
    sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
      host: config.mysql.host,
      port: config.mysql.port,
      dialect: 'mysql',
    });
    try {
      await sequelize.authenticate();
      logger.info('Connected to MySQL');
    } catch (error) {
      logger.error('Unable to connect to MySQL:', error);
      process.exit(1);
    }
  } else {
    logger.error('Unsupported database type');
    process.exit(1);
  }
};

export { connectDB, sequelize };
