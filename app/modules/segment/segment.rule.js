const Joi = require('joi');

const ruleCreateOrUpdate = {
  segment_name: Joi.string().required(),
  company_id: Joi.number().required(),
  business_id: Joi.number().required(),
  description:Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createSegment: {
    body: ruleCreateOrUpdate,
  },
  updateSegment: {
    body: ruleCreateOrUpdate,
  },
  changeStatusSegment: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
