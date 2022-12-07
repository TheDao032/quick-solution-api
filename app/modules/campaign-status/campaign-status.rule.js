const Joi = require('joi');

const ruleCreateOrUpdate = {
  campaign_status_name: Joi.string().required(),
  description: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createCampaignStatus: {
    body: ruleCreateOrUpdate,
  },
  updateCampaignStatus: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCampaignStatus: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
