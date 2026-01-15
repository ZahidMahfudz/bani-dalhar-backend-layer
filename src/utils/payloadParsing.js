const logger = require('../config/logger');

function payloadParsing(body = {}, action) {
    const getValue = (value) => value ?? "";

    const parsedPayload = {
        api_key: process.env.API_KEY,
        action: action,

        person_id: getValue(body.person_id),
        nama_lengkap: getValue(body.nama_lengkap),
        jenis_kelamin: getValue(body.jenis_kelamin),
        tempat_lahir: getValue(body.tempat_lahir),
        tanggal_lahir: getValue(body.tanggal_lahir),
        alamat_lengkap: getValue(body.alamat_lengkap),
        no_hp: getValue(body.no_hp),
        ayah_id: getValue(body.ayah_id),
        ibu_id: getValue(body.ibu_id),
        pasangan_id: getValue(body.pasangan_id),
        status_darah: getValue(body.status_darah),
        foto: getValue(body.foto)
    };

    logger.debug('Parsed payload: ' + JSON.stringify(parsedPayload));
    return parsedPayload;
}

module.exports = payloadParsing;
