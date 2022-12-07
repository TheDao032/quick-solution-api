const Joi = require('joi');

const ruleCreateOrUpdate = {
  data_leads_id: Joi.string().required(),
  task_id:Joi.number().required(),
  responsible_user_name:Joi.string().required(),
  call_type_id:Joi.number().required(),
  event_start_date_time:Joi.string().allow('', null),
  event_end_date_time:Joi.string().allow('', null),
  duration:Joi.number().required(),
  subject:Joi.string().required(),
  description:Joi.string().allow('', null),
};

const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
