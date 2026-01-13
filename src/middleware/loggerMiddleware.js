const logger = require('../config/logger')

const requestLogger = (req, res, next) => {
    logger.info(`Request ke '${req.url}' dengan method : ${req.method} `);
    logger.debug(`Request body : ${JSON.stringify(req.body)}`);
    next();
}

module.exports = {requestLogger}

