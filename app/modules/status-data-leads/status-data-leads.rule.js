const Joi = require('joi');

const ruleCreateOrUpdate = {
  status_name: Joi.string().required(),
  business_id: Joi.number().required(),
  is_won: Joi.number().valid(0, 1).required(),
  is_lost: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createStatusDataLeads: {
    body: ruleCreateOrUpdate,
  },
  updateStatusDataLeads: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStatusDataLeads: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
