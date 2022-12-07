const express = require('express');
const validate = require('express-validation');
const newsCategoryController = require('./news-category.controller');
const routes = express.Router();
const rules = require('./news-category.rule');
const prefix = '/news-category';


// Get List
routes.route('')
  .get(newsCategoryController.getListNewsCategory);

// Get List All
routes.route('/:newsCategoryId/get-options')
  .get(newsCategoryController.getListAllNewsCategory);

// Detail a area
routes.route('/:newsCategoryId(\\d+)')
  .get(newsCategoryController.detailNewsCategory);

// Create new a area
routes.route('')
  .post(validate(rules.createNewsCategory),newsCategoryController.createNewsCategory);

// Update a area
routes.route('/:newsCategoryId(\\d+)')
  .put(validate(rules.updateNewsCategory),newsCategoryController.updateNewsCategory);

// Change status
routes.route('/:newsCategoryId/change-status')
  .put(validate(rules.changeStatusNewsCategory), newsCategoryController.changeStatusNewsCategory);

// Delete a area
routes.route('/:newsCategoryId(\\d+)')
  .delete(newsCategoryController.deleteNewsCategory);

// Check order index
routes.route('/check-orderindex')
  .put(validate(rules.checkOrderIndex),newsCategoryController.checkOrderIndexNewsCategory);

// Check parent
routes.route('/:newsCategoryId/check-parent')
  .get(newsCategoryController.checkParent);

module.exports = {
  prefix,
  routes,
};
