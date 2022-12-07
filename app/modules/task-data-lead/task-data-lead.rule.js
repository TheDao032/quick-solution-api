const Joi = require('joi');

const itemsArray = Joi.object().keys({
  data_leads_id:Joi.number().required(),
  user_name:Joi.string().required(),
  supervisor_name:Joi.string().required(),
});
const ruleCreateOrUpdate = Joi.object().keys({
  task_type_id: Joi.number().required(),
  task_status_id:Joi.number().required(),
  task_name: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  parent_id: Joi.number().allow('', null),
  description:Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  list_task_dataleads: Joi.array().min(1).items(itemsArray),
});

const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  update: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  changeStatus: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  changeWorkFlow: {
    body: {
      task_workflow_id: Joi.number().required(),
      task_id: Joi.number().required(),
      data_leads_id: Joi.string().required(),
      status_data_leads_id: Joi.number().allow('', null),
    },
  },
};

module.exports = validateRules;
