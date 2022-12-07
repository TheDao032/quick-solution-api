const express = require('express');
const validate = require('express-validation');
const campaignTypeController = require('./campaign-type.controller');
const routes = express.Router();
const rules = require('./campaign-type.rule');
const prefix = '/campaign-type';

// List campaigntype
routes.route('')
  .get(campaignTypeController.getListCampaignType);

// Create new a campaigntype
routes.route('')
  .post(validate(rules.createCampaignType),campaignTypeController.createCampaignType);

// Update a campaignstatus
routes.route('/:campaignTypeId(\\d+)')
  .put(validate(rules.updateCampaignType),campaignTypeController.updateCampaignType);

// get options campaigntype for list
routes.route('/get-options-for-list')
  .get(campaignTypeController.getOptionForList);

// get options campaigntype for create
routes.route('/get-options-for-create')
  .get(campaignTypeController.getOptionForCreate);

// get options campaigntype for create
routes.route('/get-list-campaign-rl-user')
  .get(campaignTypeController.getListCampaignRlUser);

// Change status a campaigntype
routes.route('/:campaignTypeId/change-status')
  .put(validate(rules.changeStatusCampaignType), campaignTypeController.changeStatusCampaignType);

// Detail a campaigntype
routes.route('/:campaignTypeId(\\d+)')
  .get(campaignTypeController.detailCampaignType);

// Delete a campaigntype
routes.route('/:campaignTypeId(\\d+)')
  .delete(campaignTypeController.deleteCampaignType);

module.exports = {
  prefix,
  routes,
};
