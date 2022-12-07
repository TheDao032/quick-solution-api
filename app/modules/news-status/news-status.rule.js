const Joi = require('joi');

const ruleCreateOrUpdate = {
  news_status_name: Joi.string().required(),
  description: Joi.string().allow('', null),
  order_index: Joi.number().required(),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createNewsStatus: {
    body: ruleCreateOrUpdate,
  },
  updateNewsStatus: {
    body: ruleCreateOrUpdate,
  },
  changeStatusNewsStatus: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  checkOrderIndex: {
    body: {
      news_status_id: Joi.number().required(),
      order_index: Joi.number().required(),
    },
  },
};

module.exports = validateRules;
