const httpClient = require('./httpClient');
const logger = require('./logger');

async function connectToAPIGAS() {
    try {
        const response = await httpClient.get(process.env.GAS_URL,{
            params: {
                action: 'ping',
                api_key: process.env.API_KEY
            }
        })

        const result = response.data;

        if (result.status !== 'success') {
            logger.error('GAS Service did not return a valid response');
            throw new Error('Invalid response from GAS Service');
        }

        logger.info(result.massage.massage || 'GAS Service connected successfully');

        return true;
    } catch (error) {
        logger.error('Failed to connect to GAS Service: ' + error.message);
        throw error;
    }
}

module.exports = {connectToAPIGAS};