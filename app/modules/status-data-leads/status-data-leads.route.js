const express = require('express');
const validate = require('express-validation');
const statusDataLeadsController = require('./status-data-leads.controller');
const routes = express.Router();
const rules = require('./status-data-leads.rule');
const prefix = '/status-data-leads';


// List StatusDataLeads
routes.route('')
  .get(statusDataLeadsController.getListStatusDataLeads);

// Detail a StatusDataLeads
routes.route('/:status_data_leads_id(\\d+)')
  .get(statusDataLeadsController.detailStatusDataLeads);

// Create new a StatusDataLeads
routes.route('')
  .post(validate(rules.createStatusDataLeads),statusDataLeadsController.createStatusDataLeads);

// Update a StatusDataLeads
routes.route('/:status_data_leads_id(\\d+)')
  .put(validate(rules.updateStatusDataLeads),statusDataLeadsController.updateStatusDataLeads);

// Change status a StatusDataLeads
routes.route('/:status_data_leads_id/change-status')
  .put(validate(rules.changeStatusStatusDataLeads), statusDataLeadsController.changeStatusStatusDataLeads);

// Delete a campaign status
routes.route('/:status_data_leads_id(\\d+)')
  .delete(statusDataLeadsController.deleteStatusDataLeads);

// List options StatusDataLeads
routes.route('/get-options')
  .get(statusDataLeadsController.getOptions);

module.exports = {
  prefix,
  routes,
};
