const Joi = require('joi');

const ruleCreateOrUpdate = {
  status: Joi.string().allow('', null),
  hr_description: Joi.string().allow('', null),
};

const validateRules = {
  updateCandidate: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCandidate: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
