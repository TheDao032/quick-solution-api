const express = require('express');
const validate = require('express-validation');
const dataLeadsMailController = require('./data-leads-mail.controller');
const routes = express.Router();
const rules = require('./data-leads-mail.rule');
const prefix = '/data-leads-mail';
// List
//routes.route('')
//  .get(dataLeadsMailController.getListDataleadsMail);
// Email campaign
routes.route('/get-options-campaign')
  .get(dataLeadsMailController.getOptionCampaign);
// From email
routes.route('/get-options-from-email')
  .get(dataLeadsMailController.getOptionFromEmail);
// Contact group
routes.route('/:campaign_id/get-campaign')
  .get(dataLeadsMailController.getDetailCampaign);
// Create
routes.route('')
  .post(validate(rules.createDataLeadsMail),dataLeadsMailController.createDataLeadsMail);

module.exports = {
  prefix,
  routes,
};
