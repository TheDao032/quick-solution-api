const Joi = require('joi');

const ruleCreateOrUpdate = {
  task_type_name: Joi.string().required(),
  description:Joi.string().allow('', null),
  add_function_id:Joi.number().allow('', null),
  edit_function_id:Joi.number().allow('', null),
  delete_function_id:Joi.number().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  task_work_follow_list:Joi.array().min(1),
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
