const Joi = require('joi');

const ruleCreateOrUpdate = {
  user_name: Joi.string().required(),
  password: Joi.string().required(),
  customer_code: Joi.string().allow('', null),
  register_date: Joi.string().allow('', null),
  image_avatar: Joi.string().allow('', null),
  full_name: Joi.string().required(),
  birth_day: Joi.string().required(),
  gender: Joi.number().required(),
  marital_status: Joi.number().allow('', null),
  phone_number: Joi.string().required(),
  email: Joi.string().allow('', null),
  id_card: Joi.string().allow('', null),
  id_card_date: Joi.string().allow('', null),
  id_card_place: Joi.number().allow('', null),
  address: Joi.string().allow('', null),
  province_id: Joi.number().allow('', null),
  district_id: Joi.number().allow('', null),
  country_id: Joi.number().allow('', null),
  ward_id: Joi.number().allow('', null),
  is_confirm: Joi.number().valid(0, 1).required(),
  is_notification: Joi.number().valid(0, 1).required(),
  is_can_email: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
  is_change_password: Joi.number().valid(0, 1).allow('', null),
};

const validateRules = {
  createCRMAccount: {
    body: ruleCreateOrUpdate,
  },
  updateCRMAccount: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCRMAccount: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
