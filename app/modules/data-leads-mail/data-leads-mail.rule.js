const Joi = require('joi');
const ruleTaskDataleds = Joi.object().keys({
  data_leads_id: Joi.string().required(),
  task_id:Joi.number(),
});
const ruleCreateOrUpdate = Joi.object().keys({
  campaign_id:Joi.string().required(),
  campaign_name:Joi.string().allow('', null),
  sender_name:Joi.string().allow('', null),
  sender_email:Joi.string().allow('', null),
  sender_id:Joi.string().required(),
  list_id:Joi.string().required(),
  list_name:Joi.string().allow('', null),
  status:Joi.string().allow('', null),
  task_data_leads:Joi.array().required().items(ruleTaskDataleds),
});

const validateRules = {
  createDataLeadsMail:{
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  updateDataLeadsMail: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
};
module.exports = validateRules;
