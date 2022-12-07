const express = require('express');
const unitController = require('./unit.controller');
const routes = express.Router();
const prefix = '/unit';

// List options am-company
routes.route('/get-options')
  .get(unitController.getOptions);

module.exports = {
  prefix,
  routes,
};
