const Joi = require('joi');

const ruleCreateOrUpdate = {
  business_id: Joi.number().required(),
  user_list:Joi.required(),
};

const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
