const express = require('express');
const validate = require('express-validation');
const rules = require('./am-companytype.rule');
const amCompanyTypeController = require('./am-companytype.controller');

const routes = express.Router();

const prefix = '/company-type';

// List options am-companytype
routes.route('/get-options')
  .get(amCompanyTypeController.getOptions);

module.exports = {
  prefix,
  routes,
};
