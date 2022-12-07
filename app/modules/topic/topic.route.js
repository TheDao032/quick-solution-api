const express = require('express');
const validate = require('express-validation');
const topicController = require('./topic.controller');
const routes = express.Router();
const rules = require('./topic.rule');
const prefix = '/topic';


// List
routes.route('')
  .get(topicController.getListTopic);

// Detail
routes.route('/:topicId(\\d+)')
  .get(topicController.detailTopic);

// Create
routes.route('')
  .post(validate(rules.createTopic),topicController.createTopic);

// Change status
routes.route('/:topicId/change-status')
  .put(validate(rules.changeStatusTopic), topicController.changeStatusTopic);

// Update 
routes.route('/:topicId(\\d+)')
  .put(validate(rules.updateTopic),topicController.updateTopic);

// Delete 
routes.route('/:topicId(\\d+)')
  .delete(topicController.deleteTopic);

module.exports = {
  prefix,
  routes,
};
