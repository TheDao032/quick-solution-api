const Joi = require('joi');

const ruleFileAttachment = Joi.object().keys({
  attachment_name: Joi.string().required(''),
  attachment_path: Joi.string().required(''),
});

const ruleCreateOrUpdate = Joi.object().keys({
  data_leads_id: Joi.string().required(),
  task_id: Joi.number().required(),
  responsible_user_name: Joi.string().required(''),
  meeting_subject: Joi.string().allow(null).allow(''),
  content_meeting: Joi.string().required(''),
  location: Joi.string().required(''),
  event_start_date_time: Joi.string().required(''),
  event_end_date_time: Joi.string().required(''),
  file_attactments: Joi.array().allow(null).items(ruleFileAttachment),
});

const validateRules = {
  createDataLeadsMeeting:{
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  updateDataLeadsMeeting:{
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
};

module.exports = validateRules;

