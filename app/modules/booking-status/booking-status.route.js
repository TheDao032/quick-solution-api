const express = require('express');
//const validate = require('express-validation');
const bookingStatusProductController = require('./booking-status.controller');
const routes = express.Router();
//const rules = require('./campaign-status.rule');
const prefix = '/booking-status';


// List options status product
routes.route('/get-options')
  .get(bookingStatusProductController.getOptions);

module.exports = {
  prefix,
  routes,
};
