// const logger = require('./src/config/logger');
// const { connectToAPIGAS } = require('./src/config/gasConnect');
// const dotenv = require('dotenv');

import logger from './src/config/logger';
import { connectToAPIGAS } from './src/config/gasConnectTest';
import dotenv from 'dotenv/config';

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