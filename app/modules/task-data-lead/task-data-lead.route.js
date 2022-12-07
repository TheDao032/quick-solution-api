const express = require('express');
const validate = require('express-validation');
const taskDataLeadsController = require('./task-data-lead.controller');
const routes = express.Router();
const rules = require('./task-data-lead.rule');
const prefix = '/task-data-leads';


// List area
routes.route('')
  .get(taskDataLeadsController.getList);
// List area
routes.route('/get-next-previous')
  .get(taskDataLeadsController.getTaskDataleadsByNextPrevious);
//Change workflow
routes.route('/change-work-flow')
  .put(validate(rules.changeWorkFlow), taskDataLeadsController.changeWorkFlow);
module.exports = {
  prefix,
  routes,
};
