'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _catRouter = require('../router/cat-router');

var _catRouter2 = _interopRequireDefault(_catRouter);

var _loggerMiddleware = require('./middleware/logger-middleware');

var _loggerMiddleware2 = _interopRequireDefault(_loggerMiddleware);

var _errorMiddleware = require('./middleware/error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var PORT = process.env.PORT || 3000;
var server = void 0;

app.use(_catRouter2.default);
app.use(_loggerMiddleware2.default);
app.use(_errorMiddleware2.default);

app.all('*', function (request, response) {
  _logger2.default.log(_logger2.default.INFO, 'SERVER: Returning a 404 from the catch-all/default route');
  return response.status(404).send('Route Not Registered');
});

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    server = app.listen(PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is listening on PORT ' + PORT);
    });
  }).catch(function (err) {
    throw err;
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is off');
    });
  }).catch(function (err) {
    throw err;
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;