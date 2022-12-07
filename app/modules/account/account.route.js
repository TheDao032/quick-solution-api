const express = require('express');
const validate = require('express-validation');
const rules = require('./account.rule');
const crmAccountController = require('./account.controller');
const routes = express.Router();
const prefix = '/account';

// List crm-account
routes.route('')
  .get(crmAccountController.getListCRMAccount);
// create a crm-account
routes.route('')
  .post(validate(rules.createCRMAccount), crmAccountController.createCRMAccount);
// Change status a crm-account
routes.route('/:member_id(\\d+)/change-status')
  .put(validate(rules.changeStatusCRMAccount), crmAccountController.changeStatusCRMAccount);
// Update a am-busines
routes.route('/:member_id(\\d+)')
  .put(validate(rules.updateCRMAccount), crmAccountController.updateCRMAccount);
// Delete a crm-account
routes.route('/:member_id(\\d+)')
  .delete(crmAccountController.deleteCRMAccount);

// Detail a crm-account
routes.route('/:member_id(\\d+)')
  .get(crmAccountController.detailCRMAccount);

// Change pass crm-account
routes.route('/:member_id/change-password')
  .put(crmAccountController.changePassCRMAccount);

module.exports = {
  prefix,
  routes,
};
