const express = require('express');
//const validate = require('express-validation');
const statusProductController = require('./status-product.controller');
const routes = express.Router();
//const rules = require('./campaign-status.rule');
const prefix = '/status-product';


// List options status product
routes.route('/get-options')
  .get(statusProductController.getOptions);

module.exports = {
  prefix,
  routes,
};
