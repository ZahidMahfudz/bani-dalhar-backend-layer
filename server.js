const logger = require('./src/config/logger');
const { connectToAPIGAS } = require('./src/config/gasConnectTest');

const dotenv = require('dotenv');
dotenv.config();

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.dev" });
}

logger.info(`Environment: ${process.env.NODE_ENV === "production" ? "Production" : "Development"}`);
// connectToAPIGAS();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`server started at http://localhost:${PORT}`);
    // connectToAPIGAS();
})

// module.exports = app