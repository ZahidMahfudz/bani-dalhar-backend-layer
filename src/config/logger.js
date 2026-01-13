const {createLogger, format, transports} = require('winston');

const env = process.env.NODE_ENV || 'development';

const logger = createLogger({
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.printf(info => `[${info.timestamp}] [Level : ${info.level}] [Pesan : ${info.message}]`)
    ),
    transports: [
        new transports.Console({}),
    ]
});

module.exports = logger;