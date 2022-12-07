const express = require('express');
const validate = require('express-validation');
const websiteCategoryController = require('./website-category.controller');
const routes = express.Router();
const rules = require('./website-category.rule');
const prefix = '/website-category';


// Get List
routes.route('')
  .get(websiteCategoryController.getListWebsiteCategory);

// Get List All
routes.route('/get-options')
  .get(websiteCategoryController.getListAllWebsiteCategory);

// Get List All
routes.route('/get-options-website')
  .get(websiteCategoryController.getListAllWebsite);

// Get List All
routes.route('/get-options-parent')
  .get(websiteCategoryController.getListAllParent);


// Detail a area
routes.route('/:websiteCategoryId(\\d+)')
  .get(websiteCategoryController.detailWebsiteCategory);

routes.route('/get-website/:websiteId(\\d+)')
  .get(websiteCategoryController.detailWebsite);
// Create new a area
routes.route('')
  .post(validate(rules.createWebsiteCategory),websiteCategoryController.createWebsiteCategory);

// Update a area
routes.route('/:websiteCategoryId(\\d+)')
  .put(validate(rules.updateWebsiteCategory),websiteCategoryController.updateWebsiteCategory);

// Change status
routes.route('/:websiteCategoryId/change-status')
  .put(validate(rules.changeStatusWebsiteCategory), websiteCategoryController.changeStatusWebsiteCategory);

// Delete a area
routes.route('/:websiteCategoryId(\\d+)')
  .delete(websiteCategoryController.deleteWebsiteCategory);

// Check parent
routes.route('/:websiteCategoryId/check-parent')
  .get(websiteCategoryController.checkParent);

module.exports = {
  prefix,
  routes,
};
