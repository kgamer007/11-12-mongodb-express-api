'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// in express, error handling middleware must follow this exact signature of four args, where the first arg is considered the error, and is followed by request, response, next

exports.default = function (error, request, response, next) {
  _logger2.default.log(_logger2.default.ERROR, 'ERROR MIDDLEWARE: ' + JSON.stringify(error));

  // I might have a status property 
  if (error.status) {
    _logger2.default.log(_logger2.default.ERROR, 'IN FIRST IF STATEMENT: Responding with a ' + error.status + ' code and message ' + error.message);
    return response.sendStatus(error.status);
  }

  var errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    _logger2.default.log(_logger2.default.ERROR, 'Responding with a 404 status code ' + errorMessage);
    return response.sendStatus(404);
  }

  if (errorMessage.includes('validation failed')) {
    _logger2.default.log(_logger2.default.ERROR, 'Responding with a 400 code ' + errorMessage);
    return response.sendStatus(400);
  }

  if (errorMessage.includes('duplicate key')) {
    _logger2.default.log(_logger2.default.ERROR, 'Responding with a 409 status code ' + errorMessage);
    return response.sendStatus(409);
  }

  if (errorMessage.includes('unauthorized')) {
    _logger2.default.log(_logger2.default.ERROR, 'Responding with a 401 code ' + errorMessage);
    return response.sendStatus(401);
  }

  _logger2.default.log(_logger2.default.ERROR, 'Responding with a 500 code ' + JSON.stringify(error));
  next();
  return response.sendStatus(500);
};