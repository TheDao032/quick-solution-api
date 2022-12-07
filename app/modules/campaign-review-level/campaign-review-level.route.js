const express = require('express');
const validate = require('express-validation');
const campaignReviewlevelController = require('./campaign-review-level.controller');
const routes = express.Router();
const rules = require('./campaign-review-level.rule');
const prefix = '/campaign-review-level';


// List userGroup
routes.route('')
  .get(campaignReviewlevelController.getListCampaignReviewLevel);

module.exports = {
  prefix,
  routes,
};
