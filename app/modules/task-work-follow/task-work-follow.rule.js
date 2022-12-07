const Joi = require('joi');

const ruleCreateOrUpdate = {
  task_work_follow_name: Joi.string().required(),
  order_index:Joi.number().required(),
  description:Joi.string().allow('', null),
  is_complete:Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
  },
  update: {
    body: ruleCreateOrUpdate,
  },
  changeStatus: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
