const Joi = require('joi');

const ruleFileAttachment = Joi.object().keys({
  attachment_name: Joi.string().required(''),
  attachment_path: Joi.string().required(''),
});

const ruleCreateOrUpdate = Joi.object().keys({
  data_leads_id: Joi.string().required(),
  task_id: Joi.number().required(),
  user_name_comment: Joi.string().required(''),
  content_comment: Joi.string().required(''),
  file_attactments: Joi.array().allow(null).items(ruleFileAttachment),
});

const validateRules = {
  createDataLeadsComment:{
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  updateDataLeadsComment: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
};

module.exports = validateRules;

