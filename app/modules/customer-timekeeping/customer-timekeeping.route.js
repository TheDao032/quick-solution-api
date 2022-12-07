const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-timekeeping.rule');
const cusTimeController = require('./customer-timekeeping.controller');
const routes = express.Router();
const prefix = '/customer-timekeeping';

// List am-business
routes.route('')
  .get(cusTimeController.getList);

module.exports = {
  prefix,
  routes,
};
