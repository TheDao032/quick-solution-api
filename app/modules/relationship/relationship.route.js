const express = require('express');
const relationshipController = require('./relationship.controller');
const routes = express.Router();
const prefix = '/relationship';

// List options am-company
routes.route('/get-options')
  .get(relationshipController.getOptions);

module.exports = {
  prefix,
  routes,
};
