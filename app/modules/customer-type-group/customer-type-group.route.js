const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-type-group.rule');
const customerTypeController = require('./customer-type-group.controller');
const routes = express.Router();
const prefix = '/customer-type-group';

// List options customer-type
routes.route('/get-options')
  .get(customerTypeController.getOptions);

module.exports = {
  prefix,
  routes,
};
