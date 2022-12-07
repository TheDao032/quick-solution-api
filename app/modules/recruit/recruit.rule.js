const Joi = require('joi');

const ruleCreateOrUpdate = {
  recruit_title: Joi.string().required(),
  position_id: Joi.number().required(),
  business_id: Joi.number().required(),
  quantity: Joi.number().required(),
  salary_from: Joi.number().required(),
  salary_to: Joi.number().required(),
  recruit_content: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  meta_keywords: Joi.string().allow('', null),
  meta_descriptions: Joi.string().allow('', null),
  meta_title: Joi.string().allow('', null),
  seo_name: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createRecruit: {
    body: ruleCreateOrUpdate,
  },
  updateRecruit: {
    body: ruleCreateOrUpdate,
  },
  changeStatusRecruit: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
