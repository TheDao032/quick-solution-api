const express = require('express');
const validate = require('express-validation');
const taskWorkFollowController = require('./task-work-follow.controller');
const routes = express.Router();
const rules = require('./task-work-follow.rule');
const prefix = '/task-work-follow';


// List area


// Detail a area
routes.route('/:taskWorkFollowId(\\d+)')
  .get(taskWorkFollowController.detailTaskWorkFollow);

// Create new a area
routes.route('')
  .post(validate(rules.create),taskWorkFollowController.createTaskWorkFollow);

// Update a area
routes.route('/:taskWorkFollowId(\\d+)')
  .put(validate(rules.update),taskWorkFollowController.updateTaskWorkFollow);

// Change status a area


// Delete a area

// List options area
routes.route('/get-options')
  .get(taskWorkFollowController.getOptions);

module.exports = {
  prefix,
  routes,
};
