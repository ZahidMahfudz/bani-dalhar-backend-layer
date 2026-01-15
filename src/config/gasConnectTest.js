const httpClient = require('./httpClient');
const logger = require('./logger');
const {doGet} = require('../service/gasService');

async function connectToAPIGAS() {
    try {
        const response = await doGet('ping');
        logger.info('API Google Apps Script Bani Dalhar Sukses Aktif');
        return true;
    } catch (error) {
        logger.error('Failed to connect to GAS Service: ' + error.message);
        throw error;
    }
}

module.exports = {connectToAPIGAS};