const express = require('express');
const validate = require('express-validation');
const rules = require('./customer-data-lead.rule');
const customerDataLeadController = require('./customer-data-lead.controller');
const routes = express.Router();
const prefix = '/customer-data-lead';

// List customer-data-lead
routes.route('')
  .get(customerDataLeadController.getListCustomerDataLead);

// Create new a customer-data-lead
routes.route('')
  .post(validate(rules.createCustomerDataLead), customerDataLeadController.createCustomerDataLead);

// Update a customer-data-lead
routes.route('/:customerDataLeadId')
  .put(validate(rules.updateCustomerDataLead), customerDataLeadController.updateCustomerDataLead);

// Delete a customer-data-lead
routes.route('/:customerDataLeadId')
  .delete(customerDataLeadController.deleteCustomerDataLead);

// Detail a customer-data-lead
routes.route('/:customerDataLeadId')
  .get(customerDataLeadController.detailCustomerDataLead);

// Change status a customer-data-lead
routes.route('/:customerDataLeadId/change-status')
  .put(validate(rules.changeStatusCustomerDataLead), customerDataLeadController.changeStatusCustomerDataLead);

module.exports = {
  prefix,
  routes,
};
