const express = require('express');
const validate = require('express-validation');
const rules = require('./userGroup.rule');
const userGroupController = require('./userGroup.controller');
const routes = express.Router();
const prefix = '/usergroup';

// List userGroup
routes.route('')
  .get(userGroupController.getListUserGroup);

// Create new a userGroup
routes.route('')
  .post(validate(rules.createUserGroup), userGroupController.createUserGroup);

// Update a userGroup
routes.route('/:userGroupId(\\d+)')
  .put(validate(rules.updateUserGroup), userGroupController.updateUserGroup);

// Delete a userGroup
routes.route('/:userGroupId(\\d+)')
  .delete(userGroupController.deleteUserGroup);

// Detail a userGroup
routes.route('/:userGroupId(\\d+)')
  .get(userGroupController.detailUserGroup);

// List options
routes.route('/get-options')
  .get(userGroupController.getOptions);

// Change status a userGroup
routes.route('/:userGroupId/change-status')
  .put(validate(rules.changeStatusUserGroup), userGroupController.changeStatusUserGroup);

module.exports = {
  prefix,
  routes,
};
