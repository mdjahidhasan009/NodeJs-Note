const { clearHash } = require('../services/cache');

// This middleware will be executed after the route handler is
// executed, so we can clean the cache after the route handler is executed
// and the data is saved in the database
module.exports = async (req, res, next) => {
    await next();

    clearHash(req.user.id);
}