const Joi = require('joi');

const ruleCreateOrUpdate = {
  banner_type_name: Joi.string().required(),
  descriptions: Joi.string().allow(null, ''),
  is_show_home: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createBannerType: {
    body: ruleCreateOrUpdate,
  },
  updateBannerType: {
    body: ruleCreateOrUpdate,
  },
  changeStatusBannerType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
