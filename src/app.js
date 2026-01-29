import express from 'express';
import logger from './config/logger.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

logger.debug('Middleware Express berhasil dimuat');

// Import routes
import dataFamilyRoutes from './routes/dataFamilyRoutes.js';
import authenticateRoutes from './routes/authenticateRoutes.js';

// Mount routes
app.use('/dataFamily', dataFamilyRoutes);
app.use('/authenticate', authenticateRoutes);

logger.debug('Routes berhasil dimount');

app.get('/', (req, res) => {
    res.send('Hello, World! Bani Dalhar Backend API');
    logger.info('Root endpoint diakses');
});

export default app;