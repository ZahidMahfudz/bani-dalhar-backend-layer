// const logger = require('./src/config/logger');
// const { connectToAPIGAS } = require('./src/config/gasConnectTest');
// const dotenv = require('dotenv');

// import dotenv from 'dotenv';

// if (process.env.NODE_ENV === "production") {
//   dotenv.config({ path: ".env.production" });
// } else {
//   dotenv.config({ path: ".env.dev" });
// }

import './src/config/dotenvBootstrap.js';

import logger from './src/config/logger.js';
import { connectToAPIGAS } from './src/config/gasConnectTest.js';



logger.info(`Environment: ${process.env.NODE_ENV === "production" ? "Production" : "Development"}`);
// connectToAPIGAS();


// const app = require('./src/app');
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`server started at http://localhost:${PORT}`);
    // console.log(process.env.GAS_URL);
    // connectToAPIGAS();
})

// module.exports = app