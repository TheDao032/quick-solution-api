const Joi = require('joi');

const ruleCreateOrUpdate = {
  function_name: Joi.string().required(),
  function_alias: Joi.string().required(),
  function_group_id: Joi.number().required(),
  description: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createFunction: {
    body: ruleCreateOrUpdate,
  },
  updateFunction: {
    body: ruleCreateOrUpdate,
  },
  changeStatusFunction: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
