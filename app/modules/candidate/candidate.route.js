const express = require('express');
const validate = require('express-validation');
const candidateController = require('./candidate.controller');
const routes = express.Router();
const rules = require('./candidate.rule');
const prefix = '/candidate';


// Get List
routes.route('')
  .get(candidateController.getListCandidate);

// Get List Attachment
routes.route('/:candidateId/get-attachment')
  .get(candidateController.getListAttachment);

// Detail 
routes.route('/:candidateId(\\d+)')
  .get(candidateController.detailCandidate);

// Update 
routes.route('/:candidateId(\\d+)')
  .put(validate(rules.updateCandidate),candidateController.updateCandidate);

// Change status
routes.route('/:candidateId/change-status')
  .put(validate(rules.changeStatusCandidate), candidateController.changeStatusCandidate);

// Delete 
routes.route('/:candidateId(\\d+)')
  .delete(candidateController.deleteCandidate);

module.exports = {
  prefix,
  routes,
};
