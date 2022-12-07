const express = require('express');
const validate = require('express-validation');
const setupServiceController = require('./setup-service.controller');
const routes = express.Router();
const rules = require('./setup-service.rule');
const prefix = '/setup-service';

// Get List Metatitle
routes.route('/get-meta-title')
  .get(setupServiceController.getListMetaTitle);

// Get List Metakeyword
routes.route('/get-meta-keyword')
  .get(setupServiceController.getListMetaKeyword);

// Check Metatitle
routes.route('/check-meta-title')
  .put(setupServiceController.checkMetaTitle);

// Check Metakeyword
routes.route('/check-meta-keyword')
  .put(setupServiceController.checkMetaKeyword);

// Get List
routes.route('')
  .get(setupServiceController.getListSetupService);

// Detail a area
routes.route('/:setupServiceId(\\d+)')
  .get(setupServiceController.detailSetupService);

// Create new a area
routes.route('')
  .post(validate(rules.createSetupService),setupServiceController.createSetupService);

// Update a area
routes.route('/:setupServiceId(\\d+)')
  .put(validate(rules.updateSetupService),setupServiceController.updateSetupService);

// Change status
routes.route('/:setupServiceId/change-status')
  .put(validate(rules.changeSetupService), setupServiceController.changeStatusSetupService);

// Delete a area
routes.route('/:setupServiceId(\\d+)')
  .delete(setupServiceController.deleteSetupService);

module.exports = {
  prefix,
  routes,
};
