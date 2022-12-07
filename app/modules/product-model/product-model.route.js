const express = require('express');
const productModelController = require('./product-model.controller');
const routes = express.Router();
const prefix = '/product-model';

// List options am-company
routes.route('/get-options')
  .get(productModelController.getOptions);

module.exports = {
  prefix,
  routes,
};
