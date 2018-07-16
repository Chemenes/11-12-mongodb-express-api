'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Turkey from '../model/turkey';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();
const turkeyRouter = new Router();

turkeyRouter.post('/api/turkey/', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'TURKEY-ROUTER POST to /api/turkey - processing a request');
  if (!request.body.species) {
    logger.log(logger.INFO, 'TURKEY-ROUTER POST /api/turkey: Responding with 400 error for no species');
    const err = new Error('No Title Given');
    err.status = 400;
    return next(err);
  }


  Turkey.init()
    .then(() => {
      return new Turkey(request.body).save();
    })
    .then((newTurkey) => {
      logger.log(logger.INFO, `TURKEY-ROUTER POST:  a new turkey was saved: ${JSON.stringify(newTurkey)}`);
      return response.json(newTurkey);
    })
    .catch(next);
  return undefined;
});


turkeyRouter.get('/api/turkey/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'TURKEY-ROUTER GET /api/turkey/:id = processing a request');
  return Turkey.findOne({ _id: request.params.id })
    .then((turkey) => {
      if (!turkey) {
        logger.log(logger.INFO, 'TURKEY-ROUTER GET /api/turkey/:id: responding with 404 status code for no turkey found');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'TURKEY-ROUTER GET /api/turkey/:id: responding with 200 status code for successful get');
      return response.json(turkey);
    })
    .catch(next);
});


turkeyRouter.put('/api/turkey/:id?', jsonParser, (request, response, next) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'TURKEY-ROUTER PUT /api/turkey: Responding with a 400 error code for no id passed in');
    return response.sendStatus(400);
  }


  const options = {
    new: true,
    runValidators: true,
  };

  Turkey.init()
    .then(() => {
      return Turkey.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedTurkey) => {
      logger.log(logger.INFO, `TURKEY-ROUTER PUT - responding with a 200 status code for successful updated turkey: ${JSON.stringify(updatedTurkey)}`);
      return response.json(updatedTurkey);
    })
    .catch(next);
  return undefined;
});

turkeyRouter.delete('/api/turkey/:id?', (request, response, next) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'Turkey DELETE /api/turkey: DELETE missing turkey id.');
    return response.sendStatus(400);
  }
  Turkey.findByIdAndRemove(request.params.id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch(next);
  return undefined;
});

export default turkeyRouter;

