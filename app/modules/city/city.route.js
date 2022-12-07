const express = require('express');
const cityController = require('./city.controller');

const routes = express.Router();

const prefix = '/city';

// List options city
routes.route('/get-options')
  .get(cityController.getOptions);

module.exports = {
  prefix,
  routes,
};
