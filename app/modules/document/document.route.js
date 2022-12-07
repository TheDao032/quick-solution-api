const express = require('express');
const vatController = require('./document.controller');
const routes = express.Router();
const prefix = '/document';

// List options am-company
routes.route('/get-options')
  .get(vatController.getOptions);

module.exports = {
  prefix,
  routes,
};
