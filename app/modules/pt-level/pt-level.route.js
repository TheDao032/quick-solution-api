const express = require('express');
const ptLevelController = require('./pt-level.controller');
const routes = express.Router();
const prefix = '/pt-level';

// List options am-company
routes.route('/get-options')
  .get(ptLevelController.getOptions);

module.exports = {
  prefix,
  routes,
};
