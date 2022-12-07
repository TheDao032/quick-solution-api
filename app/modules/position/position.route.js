const express = require('express');
const positionController = require('./position.controller');

const routes = express.Router();

const prefix = '/position';

// List options position
routes.route('/get-options')
  .get(positionController.getOptions);

module.exports = {
  prefix,
  routes,
};
