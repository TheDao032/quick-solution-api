const express = require('express');
const originController = require('./origin.controller');
const routes = express.Router();
const prefix = '/origin';

// List options am-company
routes.route('/get-options')
  .get(originController.getOptions);

module.exports = {
  prefix,
  routes,
};
