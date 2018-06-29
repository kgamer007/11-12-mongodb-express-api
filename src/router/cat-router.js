'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Cat from '../model/cat';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const catRouter = new Router();

catRouter.post('/api/cats', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'CAT-ROUTER POST to /api/cats - processing a request');
  if (!request.body.title) {
    logger.log(logger.INFO, 'CAT-ROUTER POST /api/cats: Responding with 400 error for no title');
    return response.sendStatus(400);
  }

  Cat.init()
    .then(() => {
      return new Cat(request.body).save();
    })
    .then((newCat) => {
      logger.log(logger.INFO, `CAT-ROUTER POST:  a new cat was saved: ${JSON.stringify(newCat)}`);
      return response.json(newCat);
    })
    .catch((err) => {
      // we will hit here if we have some misc. mongodb error or parsing id error
      if (err.message.toLowerCase().includes('cast to objectid failed')) {
        logger.log(logger.ERROR, `CAT-ROUTER PUT: responding with 404 status code to mongdb error, objectId ${request.params.id} failed, ${err.message}`);
        return response.sendStatus(404);
      }

      // a required property was not included, i.e. in this case, "title"
      if (err.message.toLowerCase().includes('validation failed')) {
        logger.log(logger.ERROR, `CAT-ROUTER PUT: responding with 400 status code for bad request ${err.message}`);
        return response.sendStatus(400);
      }
      // we passed in a title that already exists on a resource in the db because in our Cat model, we set title to be "unique"
      if (err.message.toLowerCase().includes('duplicate key')) {
        logger.log(logger.ERROR, `CAT-ROUTER PUT: responding with 409 status code for dup key ${err.message}`);
        return response.sendStatus(409);
      }

      // if we hit here, something else not accounted for occurred
      logger.log(logger.ERROR, `CAT-ROUTER GET: 500 status code for unaccounted error ${JSON.stringify(err)}`);
      return response.sendStatus(500); // Internal Server Error
    });
  return undefined;
});

// you need this question mark after ":id" or else Express will skip to the catch-all in lib/server.js 
catRouter.get('/api/cats/:id?', (request, response) => {
  logger.log(logger.INFO, 'CAT-ROUTER GET /api/cats/:id = processing a request');

  // TODO:
  // if (!request.params.id) do logic here to return an array of all resources, else do the logic below
  if (!request.params.id) {
    return Cat.find({})
      .then((cat) => {
        logger.log(logger.INFO, 'CAT-ROUTER GET /api/cats code is successfull, get 200 status');
        return response.json(cat);
      })
      .catch((err) => {
        // monbodb error or parsing error
        if (err.message.toLowerCase().includes('cast to objectid failed')) {
          logger.log(logger.ERROR, `CAT-ROUTER PUT: responding with 404 status code to mongdb error, objectId ${request.params.id} failed`);
          return response.sendStatus(404);
        }
        // very bad path/random error
        logger.log(logger.ERROR, `CAT-ROUTER GET: 500 status error ${JSON.stringify(err)}`);
        return response.sendStatus(500);
      });
  }

  return Cat.findOne({ _id: request.params.id })
    .then((cat) => {
      if (!cat) {
        logger.log(logger.INFO, 'CAT-ROUTER GET /api/cats/:id: responding with 404 status code for no cat found');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'CAT-ROUTER GET /api/cats/:id: responding with 200 status code for successful get');
      return response.json(cat);
    })
    .catch((err) => {
      // we will hit here if we have a mongodb error or parsing id error
      if (err.message.toLowerCase().includes('cast to objectid failed')) {
        logger.log(logger.ERROR, `CAT-ROUTER PUT: responding with 404 status code to mongdb error, objectId ${request.params.id} failed`);
        return response.sendStatus(404);
      }

      // if we hit here, something else not accounted for occurred
      logger.log(logger.ERROR, `CAT-ROUTER GET: 500 status code for unaccounted error ${JSON.stringify(err)}`);
      return response.sendStatus(500);
    });
});

catRouter.put('/api/cats/:id?', jsonParser, (request, response) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'CAT-ROUTER PUT /api/cats: Responding with a 400 error code for no id passed in');
    return response.sendStatus(400);
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
    .catch((err) => {
      // we will hit here if we have some misc. mongodb error or parsing id error
      if (err.message.toLowerCase().includes('cast to objectid failed')) {
        logger.log(logger.ERROR, `CAT-ROUTER PUT: responding with 404 status code to mongdb error, objectId ${request.params.id} failed, ${err.message}`);
        return response.sendStatus(404);
      }

      // a required property was not included, i.e. in this case, "title"
      if (err.message.toLowerCase().includes('validation failed')) {
        logger.log(logger.ERROR, `CAT-ROUTER PUT: responding with 400 status code for bad request ${err.message}`);
        return response.sendStatus(400);
      }
      // we passed in a title that already exists on a resource in the db because in our Cat model, we set title to be "unique"
      if (err.message.toLowerCase().includes('duplicate key')) {
        logger.log(logger.ERROR, `CAT-ROUTER PUT: responding with 409 status code for dup key ${err.message}`);
        return response.sendStatus(409);
      }

      // if we hit here, something else not accounted for occurred
      logger.log(logger.ERROR, `CAT-ROUTER GET: 500 status code for unaccounted error ${JSON.stringify(err)}`);
      return response.sendStatus(500);
    });
  return undefined;
});

catRouter.delete('/api/cats/:id?', (request, response) => {
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
    .catch((err) => {
      // we will hit here if we have a mongodb error or parsing id error
      if (err.message.toLowerCase().includes('cast to objectid failed')) {
        logger.log(logger.ERROR, `CAT-ROUTER DELETE: responding with 404 status code to mongdb error, objectId ${request.params.id} failed`);
        return response.sendStatus(404);
      }
      // if we hit here, something else not accounted for occurred
      logger.log(logger.ERROR, `CAT-ROUTER DELETE: 500 status code ${JSON.stringify(err)}`);
      return response.sendStatus(500);
    });
});

export default catRouter;
