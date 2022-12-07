const express = require('express');
const validate = require('express-validation');
const bannertypeController = require('./bannertype.controller');
const routes = express.Router();
const rules = require('./bannertype.rule');
const prefix = '/bannertype';


// List
routes.route('')
  .get(bannertypeController.getListBannerType);

// Detail 
routes.route('/:banner_type_id(\\d+)')
  .get(bannertypeController.detailBannerType);

// Create 
routes.route('')
  .post(validate(rules.createBannerType),bannertypeController.createBannerType);

// Update
routes.route('/:banner_type_id(\\d+)')
  .put(validate(rules.updateBannerType),bannertypeController.updateBannerType);

// Change status 
routes.route('/:banner_type_id/change-status')
  .put(validate(rules.changeStatusBannerType), bannertypeController.changeStatusBannerType);

// Delete
routes.route('/:banner_type_id(\\d+)')
  .delete(bannertypeController.deleteBannerType);

// List options area
routes.route('/get-options')
  .get(bannertypeController.getOptions);

// Check parent
routes.route('/:banner_type_id/check-parent')
  .get(bannertypeController.checkParent);

module.exports = {
  prefix,
  routes,
};
