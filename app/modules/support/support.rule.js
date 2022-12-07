const Joi = require('joi');

const validateRules = {
  changeStatusSupport: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
