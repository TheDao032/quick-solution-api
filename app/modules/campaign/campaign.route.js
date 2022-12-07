const express = require('express');
const validate = require('express-validation');
const rules = require('./campaign.rule');
const campaignController = require('./campaign.controller');
const routes = express.Router();
const prefix = '/campaign';

// List campaign
routes.route('')
  .get(campaignController.getListCampaign);

// Create new a campaign
routes.route('')
  .post(validate(rules.createCampaign), campaignController.createCampaign);

// Update a campaign
routes.route('/:campaignId(\\d+)')
  .put(validate(rules.updateCampaign), campaignController.updateCampaign);

// Delete a campaign
routes.route('/:campaignId(\\d+)')
  .delete(campaignController.deleteCampaign);

// Detail a campaign
routes.route('/:campaignId(\\d+)')
  .get(campaignController.detailCampaign);

// List options
routes.route('/get-options')
  .get(campaignController.getOptions);

// Change status a campaign
routes.route('/:campaignId(\\d+)/change-status')
  .put(validate(rules.changeStatusCampaign), campaignController.changeStatusCampaign);

// Change status a campaign
routes.route('/:campaignId(\\d+)/approved-review-list')
  .put(validate(rules.approvedCampaignReviewList), campaignController.approvedCampaignReviewList);

// Isapprove status a company
routes.route('/:campaignId(\\d+)/is-approved')
  .get(campaignController.isApproved);

module.exports = {
  prefix,
  routes,
};
