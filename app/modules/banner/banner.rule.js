const Joi = require('joi');

const ruleCreateOrUpdate = {
  banner_type_id: Joi.number().required(),
  web_category_id: Joi.number().allow(null),
  picture_alias: Joi.string().allow(null,''),
  picture_url: Joi.string().allow(null,''),
  system_name: Joi.string().allow(null,''),
  descriptions: Joi.string().allow(null,''),
  is_slide: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createBanner: {
    body: ruleCreateOrUpdate,
  },
  updateBanner: {
    body: ruleCreateOrUpdate,
  },
  changeStatusBanner: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
