/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/polls              ->  index
 * POST    /api/polls              ->  create
 * GET     /api/polls/:id          ->  show
 * PUT     /api/polls/:id          ->  upsert
 * PATCH   /api/polls/:id          ->  patch
 * DELETE  /api/polls/:id          ->  destroy
 */

'use strict';

var debug = require('debug')('pollcontroller');

import jsonpatch from 'fast-json-patch';
import Poll from './poll.model';
import _ from 'lodash';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    debug('respondWithResult entity:', entity);
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }
    return entity.save();
  };
}


function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    debug('error:', err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Polls
export function index(req, res) {
  return Poll.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Poll from the DB
export function show(req, res) {
  return Poll.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Poll in the DB
export function create(req, res) {
  req.body.createdBy = req.user.id;
  debug('create poll info: ', req.body);
  return Poll.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function vote(req, res) {
  let id = req.body.id;
  let choice = req.body.choice;

  // client IP or user._id
  let signature = req.user ? req.user.id : req.ip;

  console.log(choice);
  debug('before find id choice= %s', choice);
  // pierw sprawdz czy uzytkownik nie oddal juz glosu po jego
  // sygnaturze ip albo user.id

  return Poll.findById(id).exec()
    .then(doc => {

      debug('signature', signature);


      // TODO: usunac votedChoice i dac w wyszukiwaniu po localStorage-u albo ze sciagnietej bazy

      let votedChoice = null;

      let isAlreadyVoted = !doc.choices.every(choice => {
        //check all choices
        votedChoice = choice.text;
        return choice.votes.every(vote => {
          //if any choice already have vote client signature then return false
          return vote.userId !== signature;
        });
      });

      debug('before throw isAlreadyVoted? ', isAlreadyVoted);
      // jesli juz oddal to wywal bleda
      if(isAlreadyVoted)
        throw `Already voted on ${votedChoice}!`;

      // jesli chocice jest typu tekstowego to znajdz po aby sprawdzic
      // czy nie zostaj juz oddany taki glos
      // jesli nie to poszukaj po wyborze

      debug('before checking string');

      if(_.isString(choice)) {
        if(!_.find(doc.choices, {
          text: choice
        }))

          doc.choices.push({
            text: choice,
            votes: [{
              userId: signature
            }]
          });

        return doc.save();
      }

      debug('after string comparision');
        // TODO: zrobic test: 'check out of range' (wyslanie od klienta
        // choice ktory jest np 999)
      doc.choices[choice].votes.push({
        userId: signature
      });

      return doc.save();
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Upserts the given Poll in the DB at the specified ID
export function upsert(req, res) {
  return Poll.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()

  .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Poll in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Poll.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Poll from the DB
export function destroy(req, res) {
  return Poll.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
