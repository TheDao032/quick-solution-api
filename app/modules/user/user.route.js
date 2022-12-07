const express = require('express');
const validate = require('express-validation');
const rules = require('./user.rule');
const userController = require('./user.controller');

const routes = express.Router();

const prefix = '/user';

// List user
routes.route('')
  .get(userController.getListUser);

// Create new a user
routes.route('')
  .post(validate(rules.createUser), userController.createUser);

// Generate username
routes.route('/create')
  .post(userController.generateUsername);

// List options function
routes.route('/get-options')
  .get(userController.getOptions);

// Reset password a user -- admin
routes.route('/:userId/change-password')
  .put(validate(rules.resetPassword), userController.resetPassword);
// Change password a user
routes.route('/:userId/change-password-user')
  .put(validate(rules.changePasswordUser), userController.changePasswordUser);
// Update a user
routes.route('/:userId')
  .put(validate(rules.updateUser), userController.updateUser);

// Delete a user
routes.route('/:userId')
  .delete(userController.deleteUser);

// Detail a user
routes.route('/:userId')
  .get(userController.detailUser);

module.exports = {
  prefix,
  routes,
};
