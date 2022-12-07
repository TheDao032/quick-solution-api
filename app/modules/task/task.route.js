const express = require('express');
const validate = require('express-validation');
const taskController = require('./task.controller');
const routes = express.Router();
const rules = require('./task.rule');
const prefix = '/task';


// List area
routes.route('')
  .get(taskController.getList);

// Detail a area
routes.route('/:taskId(\\d+)')
  .get(taskController.detail);

// Create new a area
routes.route('')
  .post(validate(rules.create),taskController.createTask);

// Update a area
routes.route('/:taskId(\\d+)')
  .put(validate(rules.update),taskController.updateTask);

// Change status a area
routes.route('/:taskId/change-status')
  .put(validate(rules.changeStatus), taskController.changeStatusTask);

// Delete a area
routes.route('/:taskId(\\d+)')
  .delete(taskController.deleteTask);

// List options area
routes.route('/get-options')
  .get(taskController.getOptions);

module.exports = {
  prefix,
  routes,
};
