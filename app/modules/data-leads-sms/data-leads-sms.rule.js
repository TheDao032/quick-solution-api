const Joi = require('joi');

const itemsArrayPhone = Joi.object().keys({
  data_leads_id:Joi.string().required(),
  phone_number:Joi.string().required(),
});
const ruleCreateOrUpdate = {
  data_leads_id: Joi.string().required(),
  task_id:Joi.number().required(),
  content_sms:Joi.string().required(),
};

const ruleCreateSendSms = {
  content_sms:Joi.string().required(),
  list_task_dataleads: Joi.array().min(1).items(itemsArrayPhone),
};

const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
  },
  sendSmsList: {
    body: ruleCreateSendSms,
  },
};

module.exports = validateRules;
