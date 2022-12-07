const Joi = require('joi');

const ruleCreateOrUpdate = {
  product_comment_id: Joi.number().required(),
  product_id: Joi.number().allow(null),
  phone_number: Joi.string().required(),
  email:Joi.string().required(),
  user_comment: Joi.string().required(),
  full_name: Joi.string().allow('', null),
  is_staff: Joi.number().valid(0, 1).allow(null),
  content_comment: Joi.string().allow(null),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createCommentReply: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
