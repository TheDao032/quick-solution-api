const express = require('express');
const validate = require('express-validation');
const dataLeadsCommentController = require('./data-leads-comment.controller');
const routes = express.Router();
const rules = require('./data-leads-comment.rule');
const prefix = '/data-leads-comment';
routes.route('/callSoapTest')
  .get(dataLeadsCommentController.callSoapTest);
// List
routes.route('')
  .get(dataLeadsCommentController.getListDataleadsComment);

// Create
routes.route('')
  .post(validate(rules.createDataLeadsComment),dataLeadsCommentController.createDataleadsComment);

module.exports = {
  prefix,
  routes,
};
