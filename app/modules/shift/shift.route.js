const express = require('express');
const vatController = require('./shift.controller');
const routes = express.Router();
const prefix = '/shift';

// List options am-company
routes.route('/get-options')
  .get(vatController.getOptions);

module.exports = {
  prefix,
  routes,
};
