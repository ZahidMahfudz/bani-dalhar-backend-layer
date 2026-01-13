const logger = require('./src/config/logger');
const { connectToAPIGAS } = require('./src/config/gasConnect');

const dotenv = require('dotenv');
dotenv.config();

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.dev" });
}

logger.info(`Environment: ${process.env.NODE_ENV === "production" ? "Production" : "Development"}`);
connectToAPIGAS();

const app = require('./src/app');

module.exports = app