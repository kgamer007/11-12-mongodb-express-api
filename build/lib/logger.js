'use strict';

var winston = require('winston');

var devLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: new Date().toDateString().replace(/ /g, '-') + '.log', level: 'verbose' }), new winston.transports.Console({ format: winston.format.simple(), level: 'info' })]
});

devLogger.INFO = 'info';
devLogger.ERROR = 'error';

var produdctionLogger = {
  log: function log() {
    return {};
  }
};

module.exports = process.env.NODE_ENV === 'production' ? produdctionLogger : devLogger;