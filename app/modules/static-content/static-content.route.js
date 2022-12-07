const express = require('express');
const validate = require('express-validation');
const staticContentController = require('./static-content.controller');
const routes = express.Router();
const rules = require('./static-content.rule');
const prefix = '/static-content';

// Get List Metatitle
routes.route('/get-meta-title')
  .get(staticContentController.getListMetaTitle);

// Get List Metakeyword
routes.route('/get-meta-keyword')
  .get(staticContentController.getListMetaKeyword);

// Check Metatitle
routes.route('/check-meta-title')
  .put(staticContentController.checkMetaTitle);

// Check Metakeyword
routes.route('/check-meta-keyword')
  .put(staticContentController.checkMetaKeyword);

// List store
routes.route('')
  .get(staticContentController.getListStaticContent);

// Detail a area
routes.route('/:staticContentId(\\d+)')
  .get(staticContentController.detailStaticContent);

// Create new a area
routes.route('')
  .post(validate(rules.createStaticContent),staticContentController.createStaticContent);

// Update a area
routes.route('/:staticContentId(\\d+)')
  .put(validate(rules.updateStaticContent),staticContentController.updateStaticContent);

// Change status a area
routes.route('/:staticContentId/change-status')
  .put(validate(rules.changeStatusStaticContent), staticContentController.changeStatusStaticContent);

// Delete a area
routes.route('/:staticContentId(\\d+)')
  .delete(staticContentController.deleteStaticContent);


module.exports = {
  prefix,
  routes,
};
