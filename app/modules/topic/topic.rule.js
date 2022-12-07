const Joi = require('joi');

const ruleCreateOrUpdate = {
  topic_name: Joi.string().required(),
  descriptions: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createTopic: {
    body: ruleCreateOrUpdate,
  },
  updateTopic: {
    body: ruleCreateOrUpdate,
  },
  changeStatusTopic: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
