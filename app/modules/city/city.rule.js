const Joi = require('joi');

const ruleCreateOrUpdate = {
  city_name: Joi.string().required(),
  keywords: Joi.string().required(),
  zip_code: Joi.string().required(),
  state_id: Joi.number().required(),
  priority: Joi.number().required(),
};

const validateRules = {
  createCity: ruleCreateOrUpdate,
  updateCity: ruleCreateOrUpdate,
};

module.exports = validateRules;
