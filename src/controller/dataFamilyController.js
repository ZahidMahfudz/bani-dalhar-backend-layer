const logger = require('../config/logger');
const httpClient = require('../config/httpClient');
const { log } = require('winston');
const payloadParsing = require('../utils/payloadParsing');

async function getDataFamilyById(req, res) {
    logger.debug('memasuki controller getDataFamilyById dengan params: ' + JSON.stringify(req.params));
    const { id } = req.params;

    try {
        logger.debug(`Mengirim request ke GAS Service untuk mendapatkan data family dengan ID: ${id}`);
        const response = await httpClient.get(process.env.GAS_URL, {
            params: {
                api_key: process.env.API_KEY,
                action: 'getFamily',
                id: id
            }
        })
        logger.debug('Response dari GAS Service: ' + JSON.stringify(response.data));
        const result = response.data;

        logger.debug(`Data family with ID ${id} retrieved successfully`);
        return res.status(200).json(result.data);

    } catch (error) {
        logger.error(`Error retrieving data family with ID ${id}: ` + error.message);
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve data family' });
    }
}

async function getDataById(req, res) {
    logger.debug('memasuki controller getDataById dengan params: ' + JSON.stringify(req.params));
    const { id } = req.params;

    try {
        logger.debug(`Mengirim request ke GAS Service untuk mendapatkan data dengan ID: ${id}`);
        const response = await httpClient.get(process.env.GAS_URL, {
            params: {
                api_key: process.env.API_KEY,
                action: 'getById',
                id: id
            }
        })
        logger.debug('Response dari GAS Service: ' + JSON.stringify(response.data));
        const result = response.data;

        logger.debug(`Data with ID ${id} retrieved successfully`);
        return res.status(200).json(result.data);

    } catch (error) {
        logger.error(`Error retrieving data with ID ${id}: ` + error.message);
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve data' });
    }
}

async function getDataAll(req, res) {
    logger.debug('memasuki controller getDataAll');

    try {
        logger.debug(`Mengirim request ke GAS Service untuk mendapatkan semua data`);
        const response = await httpClient.get(process.env.GAS_URL, {
            params: {
                api_key: process.env.API_KEY,
                action: 'getAll'
            }
        })
        logger.debug('Response dari GAS Service: ' + JSON.stringify(response.data));
        const result = response.data;

        logger.debug(`All data retrieved successfully`);
        return res.status(200).json(result.data);

    } catch (error) {
        logger.error(`Error retrieving all data: ` + error.message);
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve all data' });
    }
}

async function postAddPersonData(req, res) {
    logger.debug('memasuki controller postAddPersonData dengan body: ' + JSON.stringify(req.body));

    const body = payloadParsing(req.body, 'create')

    try {
        logger.debug(`Mengirim request ke GAS Service untuk menambahkan data person: ` + JSON.stringify(body));
        const response = await httpClient.post(process.env.GAS_URL, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        logger.debug('Response dari GAS Service: ' + JSON.stringify(response.data));
        const result = response.data;

        logger.debug(`Person data added successfully`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error adding person data: ` + error.message);
        return res.status(500).json({ status: 'error', message: 'Failed to add person data' });
    }
}

module.exports = { getDataFamilyById, getDataById, getDataAll, postAddPersonData };