const express = require('express');
const validate = require('express-validation');
const businessUserController = require('./business-user.controller');
const routes = express.Router();
const rules = require('./business-user.rule');
const prefix = '/business-user';


// List area
routes.route('')
  .get(businessUserController.getList);

// Create new a area
routes.route('')
  .post(validate(rules.create),businessUserController.create);

// Delete a area
routes.route('')
  .delete(businessUserController.deleteBU);

module.exports = {
  prefix,
  routes,
};
