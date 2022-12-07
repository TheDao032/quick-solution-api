const express = require('express');
const validate = require('express-validation');
const campaignStatusController = require('./campaign-status.controller');
const routes = express.Router();
const rules = require('./campaign-status.rule');
const prefix = '/campaign-status';


// List campaignstatus
routes.route('')
  .get(campaignStatusController.getListCampaignStatus);

// Detail a campaignstatus
routes.route('/:campaignStatusId(\\d+)')
  .get(campaignStatusController.detailCampaignStatus);

// Create new a campaignstatus
routes.route('')
  .post(validate(rules.createCampaignStatus),campaignStatusController.createCampaignStatus);

// Update a campaignstatus
routes.route('/:campaignStatusId(\\d+)')
  .put(validate(rules.updateCampaignStatus),campaignStatusController.updateCampaignStatus);

// Change status a campaignstatus
routes.route('/:campaignStatusId/change-status')
  .put(validate(rules.changeStatusCampaignStatus), campaignStatusController.changeStatusCampaignStatus);

// Delete a campaign status
routes.route('/:campaignStatusId(\\d+)')
  .delete(campaignStatusController.deleteCampaignStatus);

// List options campaignstatus
routes.route('/get-options')
  .get(campaignStatusController.getOptions);

module.exports = {
  prefix,
  routes,
};
