const express = require('express');
const validate = require('express-validation');
const supportController = require('./support.controller');
const routes = express.Router();
const rules = require('./support.rule');
const prefix = '/support';


// List
routes.route('')
  .get(supportController.getListSupport);

// Get List All
routes.route('/get-options')
  .get(supportController.getListAllSupport);

// Detail a area
routes.route('/:supportId(\\d+)')
  .get(supportController.detailSupport);

// Change status
routes.route('/:supportId/change-status')
  .put(validate(rules.changeStatusSupport), supportController.changeStatusSupport);

// Delete a area
routes.route('/:supportId(\\d+)')
  .delete(supportController.deleteSupport);

module.exports = {
  prefix,
  routes,
};
