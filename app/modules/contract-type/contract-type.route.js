const express = require('express');
const validate = require('express-validation');
const contractTypeController = require('./contract-type.controller');
const routes = express.Router();
const rules = require('./contract-type.rule');
const prefix = '/contract-type';


// List area
routes.route('')
  .get(contractTypeController.getListContractType);

// Detail a area
routes.route('/:contractTypeId(\\d+)')
  .get(contractTypeController.detailContractType);

// Create new a area
routes.route('')
  .post(validate(rules.create),contractTypeController.createContractType);

// Update a area
routes.route('/:contractTypeId(\\d+)')
  .put(validate(rules.update),contractTypeController.updateContractType);

// Change status a area
routes.route('/:contractTypeId/change-status')
  .put(validate(rules.changeStatus), contractTypeController.changeStatusContractType);

// Delete a area
routes.route('/:contractTypeId(\\d+)')
  .delete(contractTypeController.deleteContractType);

// List options area
routes.route('/get-options')
  .get(contractTypeController.getOptions);

module.exports = {
  prefix,
  routes,
};
