// const logger = require('../config/logger')
import logger from '../config/logger.js';

const requestLogger = (req, res, next) => {
    logger.info(`Request ke '${req.url}' dengan method : ${req.method} `);
    logger.debug(`Request body : ${JSON.stringify(req.body)}`);
    next();
}

// module.exports = {requestLogger}
export default {requestLogger};



