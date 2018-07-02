'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Cat from '../model/cat';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const catRouter = new Router();

catRouter.post('/api/cats', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'CAT-ROUTER POST to /api/cats - processing a request');
  if (!request.body.title) {
    const err = new Error('Where is your name?');
    err.status = 400;
    next(err);
  }

  Cat.init()
    .then(() => {
      return new Cat(request.body).save();
    })
    .then((newCat) => {
      logger.log(logger.INFO, `CAT-ROUTER POST:  a new cat was saved: ${JSON.stringify(newCat)}`);
      return response.json(newCat);
    })
    .catch(next);
  return undefined;
});

// you need this question mark after ":id" or else Express will skip to the catch-all in lib/server.js 
catRouter.get('/api/cats/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'CAT-ROUTER GET /api/cats/:id = processing a request');

  // TODO:
  // if (!request.params.id) do logic here to return an array of all resources, else do the logic below
  if (!request.params.id) {
    return Cat.find({})
      .then((cat) => {
        logger.log(logger.INFO, 'CAT-ROUTER GET /api/cats code is successfull, get 200 status');
        return response.json(cat);
      })
      .catch(next);
  }

  return Cat.findOne({ _id: request.params.id })
    .then((cat) => {
      if (!cat) {
        const err = new Error(`Cat ${request.params.id} not found`);
        err.status = 404;
        next(err);
      }
      logger.log(logger.INFO, 'CAT-ROUTER GET /api/cats/:id: responding with 200 status code for successful get');
      return response.json(cat);
    })
    .catch(next);
});

catRouter.put('/api/cats/:id?', jsonParser, (request, response, next) => {
  if (!request.params.id) {
    const err = new Error('An ID is required here');
    err.status = 400;
    next(err);
  }

  const options = {
    new: true,
    runValidators: true,
  };

  Cat.init()
    .then(() => {
      return Cat.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedCat) => {
      logger.log(logger.INFO, `CAT-ROUTER PUT - responding with a 200 status code for successful updated cat: ${JSON.stringify(updatedCat)}`);
      return response.json(updatedCat);
    })
    .catch(next);
  return undefined;
});

catRouter.delete('/api/cats/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'CAT-ROUTER DELETE /api/cats/:id = processing a request');

  if (!request.params.id) {
    return response.sendStatus(404);
  }

  return Cat.deleteOne({ _id: request.params.id })
    .then((data) => {
      if (!data.n) {
        logger.log(logger.INFO, 'CAT-ROUTER DELETE /api/cats/:id responding with 404 status no cats');
        return response.sendStatus(400);
      }

      logger.log(logger.INFO, 'CAT-ROUTER DELETE api/cats responding with 204 status, cat is gone');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default catRouter;
