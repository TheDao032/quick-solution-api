const express = require('express');
const validate = require('express-validation');
const setupServiceRegisterController = require('./setup-service-register.controller');
const routes = express.Router();
const prefix = '/setup-service-register';


// Get List All
routes.route('/get-setup-service')
  .get(setupServiceRegisterController.getListAllSetupService);

// Get List
routes.route('')
  .get(setupServiceRegisterController.getListSetupServiceRegister);

// Detail a area
routes.route('/:registerSetupId(\\d+)')
  .get(setupServiceRegisterController.detailSetupServiceRegister);

// Delete a area
routes.route('/:registerSetupId(\\d+)')
  .delete(setupServiceRegisterController.deleteSetupServiceRegister);

module.exports = {
  prefix,
  routes,
};
