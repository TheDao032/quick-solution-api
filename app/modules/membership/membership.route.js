const express = require('express');
const validate = require('express-validation');
const membershipController = require('./membership.controller');
const routes = express.Router();
const rules = require('./membership.rule');
const prefix = '/membership';
// List
routes.route('')
  .get(membershipController.getListMembership);

// Detail 
routes.route('/:membership_id(\\d+)')
  .get(membershipController.detailMembership);

// Change status 
routes.route('/:membership_id(\\d+)/change-status')
  .put(validate(rules.changeStatusMembership), membershipController.changeStatusMembership);

// Delete 
routes.route('/:membership_id(\\d+)')
  .delete(membershipController.deleteMembership);

module.exports = {
  prefix,
  routes,
};
