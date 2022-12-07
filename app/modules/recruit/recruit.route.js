const express = require('express');
const validate = require('express-validation');
const recruitController = require('./recruit.controller');
const routes = express.Router();
const rules = require('./recruit.rule');
const prefix = '/recruit';


// List userGroup
routes.route('')
  .get(recruitController.getListRecruit);

// Detail a company
routes.route('/:recruit_id(\\d+)')
  .get(recruitController.detailRecruit);

// Create new a userGroup
routes.route('')
  .post(validate(rules.createRecruit),recruitController.createRecruit);

// Update a userGroup
routes.route('/:recruit_id(\\d+)')
  .put(validate(rules.updateRecruit),recruitController.updateRecruit);

// Change status a company
routes.route('/:recruit_id/change-status')
  .put(validate(rules.changeStatusRecruit), recruitController.changeStatusRecruit);

// Delete a company
routes.route('/:recruit_id(\\d+)')
  .delete(recruitController.deleteRecruit);

// List options am-company
routes.route('/get-options')
  .get(recruitController.getOptions);

module.exports = {
  prefix,
  routes,
};
