const express = require('express');
const validate = require('express-validation');
const newsStatusController = require('./news-status.controller');
const routes = express.Router();
const rules = require('./news-status.rule');
const prefix = '/news-status';


// Get List
routes.route('')
  .get(newsStatusController.getListNewsStatus);

// Get List All
routes.route('/get-options')
  .get(newsStatusController.getListAllNewsStatus);

// Detail a area
routes.route('/:newsStatusId(\\d+)')
  .get(newsStatusController.detailNewsStatus);

// Create new a area
routes.route('')
  .post(validate(rules.createNewsStatus),newsStatusController.createNewsStatus);

// Update a area
routes.route('/:newsStatusId(\\d+)')
  .put(validate(rules.updateNewsStatus),newsStatusController.updateNewsStatus);

// Change status
routes.route('/:newsStatusId/change-status')
  .put(validate(rules.changeStatusNewsStatus), newsStatusController.changeStatusNewsStatus);

// Delete a area
routes.route('/:newsStatusId(\\d+)')
  .delete(newsStatusController.deleteNewsStatus);

// Check order index
routes.route('/check-orderindex')
  .put(validate(rules.checkOrderIndex),newsStatusController.checkOrderIndexNewsStatus);

module.exports = {
  prefix,
  routes,
};
