const express = require('express');
const validate = require('express-validation');
const taskTypeController = require('./task-type.controller');
const routes = express.Router();
const rules = require('./task-type.rule');
const prefix = '/task-type';


// List area
routes.route('')
  .get(taskTypeController.getList);

// Detail a area
routes.route('/:taskTypeId(\\d+)')
  .get(taskTypeController.detail);

// Create new a area
routes.route('')
  .post(validate(rules.create),taskTypeController.createTaskType);

// Update a area
routes.route('/:taskTypeId(\\d+)')
  .put(validate(rules.update),taskTypeController.updateTaskType);

// Change status a area
routes.route('/:taskTypeId/change-status')
  .put(validate(rules.changeStatus), taskTypeController.changeStatusTaskType);

// Delete a area
routes.route('/:taskTypeId(\\d+)')
  .delete(taskTypeController.deleteTaskType);

// List options area
routes.route('/get-options')
  .get(taskTypeController.getOptions);

// get options campaigntype for list
routes.route('/get-options-for-list')
  .get(taskTypeController.getOptionForList);

// get options campaigntype for create
routes.route('/get-options-for-create')
  .get(taskTypeController.getOptionForCreate);

module.exports = {
  prefix,
  routes,
};
