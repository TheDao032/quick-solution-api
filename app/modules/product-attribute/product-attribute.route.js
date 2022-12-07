const express = require('express');
const validate = require('express-validation');
const productAttributeController = require('./product-attribute.controller');
const routes = express.Router();
const prefix = '/product-attribute';
const rules = require('./product-attribute.rule');
// List
routes.route('')
  .get(productAttributeController.getListProductAttribute);
// Change status 
routes.route('/:product_attribute_id(\\d+)/change-status')
  .put(validate(rules.changeStatusProductAttribute), productAttributeController.changeStatusProductAttribute);
// Detail 
routes.route('/:product_attribute_id(\\d+)')
  .get(productAttributeController.detailProductAttribute);
// List options am-company
routes.route('/get-options')
  .get(productAttributeController.getOptions);
// Create
routes.route('')
  .post(validate(rules.createProductAttribute),productAttributeController.createProductAttribute);
// Update
routes.route('/:product_attribute_id(\\d+)')
  .put(validate(rules.updateProductAttribute),productAttributeController.updateProductAttribute);
// Delete 
routes.route('/:product_attribute_id(\\d+)')
  .delete(productAttributeController.deleteProductAttribute);
module.exports = {
  prefix,
  routes,
};
