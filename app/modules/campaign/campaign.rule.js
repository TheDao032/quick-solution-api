const Joi = require('joi');

const ruleCreateOrUpdate = {
  campaign_name: Joi.string().required(),
  campaign_type_id: Joi.number().required(),
  campaign_status_id: Joi.number().required(),
  company_id: Joi.number().required(),
  business_id: Joi.number().required(),
  total_values: Joi.number().min(1).required(),
  description: Joi.string().required(),
  is_active: Joi.number().required().valid(0, 1),
};

const validateRules = {
  createCampaign: {
    body: ruleCreateOrUpdate,
  },
  updateCampaign: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCampaign: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  approvedCampaignReviewList: {
    body: {
      review_list_id: Joi.number().required(),
      is_review: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
