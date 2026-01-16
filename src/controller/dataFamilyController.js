const logger = require('../config/logger');
const httpClient = require('../config/httpClient');
const payloadParsing = require('../utils/payloadParsing');
const {doGet, doPost} = require('../service/gasService');

async function getDataFamilyById(req, res) {
    logger.debug('memasuki controller getDataFamilyById dengan params: ' + JSON.stringify(req.params));
    const { id } = req.params;

    try {
        logger.debug(`Mengirim request ke GAS Service untuk mendapatkan data family dengan ID: ${id}`);
        const response = await doGet('getFamily', id);

        logger.debug(`Transaksi getDataFamilyById dengan id:${id} selesai`);
        return res.status(200).json(response);

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
        const response = await doGet('getById', id);

        logger.debug(`Transaksi getDataById dengan id:${id} selesai`);
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error retrieving data with ID ${id}: ` + error.message);
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve data' });
    }
}

async function getDataAll(res) {
    logger.debug('memasuki controller getDataAll');

    try {
        logger.debug(`Mengirim request ke GAS Service untuk mendapatkan semua data`);
        const response = await doGet('getAll');

        logger.debug(`Transaksi getDataAll selesai`);
        return res.status(200).json(response);

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
        const response = await doPost('create', body);

        logger.debug(`Transaksi postAddPersonData selesai`);
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error adding person data: ` + error.message);
        return res.status(500).json({ status: 'error', message: 'Failed to add person data' });
    }
}

async function postUpdatePersonData(req, res) {
    logger.debug('memasuki controller postUpdatePersonData dengan body: ' + JSON.stringify(req.body));

    const body = payloadParsing(req.body, 'update');

    try {
        logger.debug(`Mengirim request ke GAS Service untuk mengupdate data person: ` + JSON.stringify(body));
        const response = await doPost('update', body);

        logger.debug(`Transaksi postUpdatePersonData selesai`);
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error updating person data: ` + error.message);
        return res.status(500).json({ status: 'error', message: 'Failed to update person data' });
    }
}

async function postDeletePersonData(req, res) {
    logger.debug('memasuki controller postDeletePersonData dengan body: ' + JSON.stringify(req.body));
    const body = payloadParsing(req.body, 'delete');

    try {
        logger.debug(`Mengirim request ke GAS Service untuk menghapus data person: ` + JSON.stringify(body));
        const response = await doPost('delete', body);

        logger.debug(`Transaksi postDeletePersonData selesai`);
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error deleting person data: ` + error.message);
        return res.status(500).json({ status: 'error', message: 'Failed to delete person data' });
    }
}

module.exports = { getDataFamilyById, getDataById, getDataAll, postAddPersonData, postUpdatePersonData, postDeletePersonData };