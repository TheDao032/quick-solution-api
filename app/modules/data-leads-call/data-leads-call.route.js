const express = require('express');
const validate = require('express-validation');
const taskDataLeadsCallController = require('./data-leads-call.controller');
const routes = express.Router();
const rules = require('./data-leads-call.rule');
const prefix = '/data-leads-call';

// List
routes.route('')
  .get(taskDataLeadsCallController.getListDataleadsCall);

// Create
routes.route('')
  .post(validate(rules.create),taskDataLeadsCallController.createDataLeadsCall);

module.exports = {
  prefix,
  routes,
};
