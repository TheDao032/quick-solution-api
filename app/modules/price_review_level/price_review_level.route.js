const express = require('express');
const validate = require('express-validation');
const pricereviewlevelController = require('./price_review_level.controller');
const routes = express.Router();
const prefix = '/price_review_level';

// List options
routes.route('/get-options')
  .get(pricereviewlevelController.getOptions);

module.exports = {
  prefix,
  routes,
};
