const express = require('express');
const validate = require('express-validation');
const rules = require('./am-business.rule');
const amBusinessController = require('./am-business.controller');
const routes = express.Router();
const prefix = '/business';

// List am-business
routes.route('')
  .get(amBusinessController.getListAMBusiness);
// create a am-business
routes.route('')
  .post(validate(rules.createAMBusiness), amBusinessController.createAMBusiness);
// Change status a am-business
routes.route('/:business_id(\\d+)/change-status')
  .put(validate(rules.changeStatusAMBusiness), amBusinessController.changeStatusAMBusiness);
// Update a am-busines
routes.route('/:business_id(\\d+)')
  .put(validate(rules.updateAMBusiness), amBusinessController.updateAMBusiness);
// Delete a am-business
routes.route('/:business_id(\\d+)')
  .delete(amBusinessController.deleteAMBusiness);

// Detail a am-business
routes.route('/:business_id(\\d+)')
  .get(amBusinessController.detailAMBusiness);


// List options am-business
routes.route('/get-options')
  .get(amBusinessController.getOptions);

// List options am-business
routes.route('/get-options-by-user')
  .get(amBusinessController.getOptionsByUser);

module.exports = {
  prefix,
  routes,
};
