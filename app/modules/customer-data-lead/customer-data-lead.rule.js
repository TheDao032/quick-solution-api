const Joi = require('joi');

const ruleCreateOrUpdate = {
  full_name: Joi.string().required(),
  gender: Joi.number().valid(0, 1, -1).required(),
  birthday: Joi.string().regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/),
  phone_number: Joi.string().required(),
  business_id: Joi.number().required(),
  status_data_leads_id: Joi.number().required(),
  // marital_status: Joi.number().valid(0, 1).required(),
  // country_id: Joi.number().required(),
  // country_name: Joi.string().required(),
  // province_id: Joi.number().required(),
  // province_name: Joi.string().required(),
  // district_id: Joi.number().required(),
  // district_name: Joi.string().required(),
  // ward_id: Joi.number().required(),
  // ward_name: Joi.string().required(),
  // address: Joi.string().required(),
  campaign_id: Joi.number().allow('',null),
  segment_id: Joi.array().min(1),
};

const validateRules = {
  createCustomerDataLead: {
    body: ruleCreateOrUpdate,
  },
  updateCustomerDataLead: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCustomerDataLead: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  approvedCustomerDataLeadReviewList: {
    body: {
      review_list_id: Joi.number().required(),
      is_review: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
