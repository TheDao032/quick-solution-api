const Joi = require('joi');

const ruleCreateOrUpdate = {
  webcategory_id: Joi.number().allow(null),
  static_title: Joi.string().required(),
  static_content: Joi.string().required(),
  system_name:Joi.string().required(),
  meta_keywords:Joi.string().allow('', null),
  meta_data_scriptions: Joi.string().allow('', null),
  meta_title: Joi.string().allow('', null),
  seo_name: Joi.string().allow('', null),
  display_order: Joi.number().allow(null),
  is_active: Joi.number().valid(0, 1).required(),
  is_childrent: Joi.number().valid(0, 1).allow(null),
};

const validateRules = {
  createStaticContent: {
    body: ruleCreateOrUpdate,
  },
  updateStaticContent: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStaticContent: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
