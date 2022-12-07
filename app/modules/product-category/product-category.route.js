const express = require('express');
const validate = require('express-validation');
const producCategoryController = require('./product-category.controller');
const routes = express.Router();
const rules = require('./product-category.rule');
const prefix = '/product-category';


// List area
routes.route('')
  .get(producCategoryController.getList);

// Detail a area
routes.route('/:productCategoryId(\\d+)')
  .get(producCategoryController.detail);

// Create new a area
routes.route('')
  .post(validate(rules.create),producCategoryController.createProductCategory);

// Update a area
routes.route('/:productCategoryId(\\d+)')
  .put(validate(rules.update),producCategoryController.updateProductCategory);

// Change status a area
routes.route('/:productCategoryId/change-status')
  .put(validate(rules.changeStatus), producCategoryController.changeStatusProductCategory);

// Delete a area
routes.route('/:productCategoryId(\\d+)')
  .delete(producCategoryController.deleteProductCategory);

// List options area
routes.route('/get-options')
  .get(producCategoryController.getOptions);

// get options campaigntype for list
routes.route('/get-options-for-list')
  .get(producCategoryController.getOptionForList);

// get options campaigntype for create
routes.route('/get-options-for-create')
  .get(producCategoryController.getOptionForCreate);

module.exports = {
  prefix,
  routes,
};
