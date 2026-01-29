// const logger = require('./logger');
// const {doGet} = require('../service/gasService');

import logger from './logger.js';
import {doGet} from '../service/gasService.js';

export async function connectToAPIGAS() {
    try {
        const response = await doGet('ping');
        logger.info('API Google Apps Script Bani Dalhar Sukses Aktif');
        return true;
    } catch (error) {
        logger.error('Failed to connect to GAS Service: ' + error.message);
        throw error;
    }
}

// module.exports = {connectToAPIGAS};