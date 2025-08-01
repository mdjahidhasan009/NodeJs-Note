import { sequelize } from './db.js';
import logger from './logger.js';
// await import('../models/mysql/userModel.js');
// await import('../models/mysql/userDetails.js');

const syncModels = async () => {
  try {
    // Import User AFTER this function is called (after DB connection)
    // const { default: User } = await import('../models/mysql/userModel.js');
    
    // Sync should not used in production should consider using migrations instead
    // await User.sync({ alter: true });
    // logger.info('User table synced successfully');

    await import('../models/mysql/userModel.js');
    await import('../models/mysql/userDetails.js');

    await sequelize.sync({ alter: true });
    logger.info('All models synced successfully');
    
  } catch (error) {
    logger.error('Error syncing models:', error);
    throw error;
  }
};

export default syncModels;