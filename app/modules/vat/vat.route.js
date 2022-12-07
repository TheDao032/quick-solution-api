const express = require('express');
const vatController = require('./vat.controller');
const routes = express.Router();
const prefix = '/vat';

// List options am-company
routes.route('/get-options')
  .get(vatController.getOptions);

module.exports = {
  prefix,
  routes,
};
