const httpClient = require('../config/httpClient');
const logger = require('../config/logger');


async function doGet(action, id = null) {
    logger.debug(`memasuki service doGet dengan action: ${action}, id: ${id}`);

    try {
        const params = {
            api_key: process.env.API_KEY,
            action: action
        }

        if (id) {
            params.id = id;
        }

        const response = await httpClient.get(process.env.GAS_URL, {
            params: params
        });

        if (response.data.status !== 'success') {
            logger.error(`GAS Service returned an error for action: ${action}, id: ${id}, message: ` + JSON.stringify(response.data.message));
            throw new Error('Error response from GAS Service');
        }

        logger.debug('Response dari GAS Service: ' + JSON.stringify(response.data));
        const result = response.data;

        logger.debug(`doGet dengan action: ${action}, id: ${id} berhasil`);
        return result.data;

    } catch (error) {
        logger.error(`Error in doGet with action: ${action}, id: ${id}: ` + error.message);
        throw error;
    }
}

module.exports = { doGet };

