const Joi = require('joi');

const ruleCreateOrUpdate = {
  position_name: Joi.string().required(),
  priority: Joi.number().required(),
};

const validateRules = {
  createPosition: ruleCreateOrUpdate,
  updatePosition: ruleCreateOrUpdate,
};

module.exports = validateRules;

