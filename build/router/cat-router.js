'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cat = require('../model/cat');

var _cat2 = _interopRequireDefault(_cat);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = _bodyParser2.default.json();
var catRouter = new _express.Router();

catRouter.post('/api/cats', jsonParser, function (request, response, next) {
  _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER POST to /api/cats - processing a request');
  if (!request.body.title) {
    var err = new Error('Where is your name?');
    err.status = 400;
    next(err);
  }

  _cat2.default.init().then(function () {
    return new _cat2.default(request.body).save();
  }).then(function (newCat) {
    _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER POST:  a new cat was saved: ' + JSON.stringify(newCat));
    return response.json(newCat);
  }).catch(next);
  return undefined;
});

// you need this question mark after ":id" or else Express will skip to the catch-all in lib/server.js 
catRouter.get('/api/cats/:id?', function (request, response, next) {
  _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER GET /api/cats/:id = processing a request');

  // TODO:
  // if (!request.params.id) do logic here to return an array of all resources, else do the logic below
  if (!request.params.id) {
    return _cat2.default.find({}).then(function (cat) {
      _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER GET /api/cats code is successfull, get 200 status');
      return response.json(cat);
    }).catch(next);
  }

  return _cat2.default.findOne({ _id: request.params.id }).then(function (cat) {
    if (!cat) {
      var err = new Error('Cat ' + request.params.id + ' not found');
      err.status = 404;
      next(err);
    }
    _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER GET /api/cats/:id: responding with 200 status code for successful get');
    return response.json(cat);
  }).catch(next);
});

catRouter.put('/api/cats/:id?', jsonParser, function (request, response, next) {
  if (!request.params.id) {
    var err = new Error('An ID is required here');
    err.status = 400;
    next(err);
  }

  var options = {
    new: true,
    runValidators: true
  };

  _cat2.default.init().then(function () {
    return _cat2.default.findByIdAndUpdate(request.params.id, request.body, options);
  }).then(function (updatedCat) {
    _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER PUT - responding with a 200 status code for successful updated cat: ' + JSON.stringify(updatedCat));
    return response.json(updatedCat);
  }).catch(next);
  return undefined;
});

catRouter.delete('/api/cats/:id?', function (request, response, next) {
  _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER DELETE /api/cats/:id = processing a request');

  if (!request.params.id) {
    return response.sendStatus(404);
  }

  return _cat2.default.deleteOne({ _id: request.params.id }).then(function (data) {
    if (!data.n) {
      _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER DELETE /api/cats/:id responding with 404 status no cats');
      return response.sendStatus(400);
    }

    _logger2.default.log(_logger2.default.INFO, 'CAT-ROUTER DELETE api/cats responding with 204 status, cat is gone');
    return response.sendStatus(204);
  }).catch(next);
});

exports.default = catRouter;