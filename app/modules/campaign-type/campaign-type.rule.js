const Joi = require('joi');
const ruleCamtype_Relevel = Joi.object().keys({
  campaign_review_level_id: Joi.number().required(),
  review_order_index: Joi.number().required(),
  department_id: Joi.number().required(),
  user_name: Joi.array().required().items(Joi.string().required()),
});
const ruleCreateOrUpdate = Joi.object().keys({
  campaign_type_name: Joi.string().required(),
  add_function_id: Joi.string().required(),
  edit_function_id: Joi.string().required(),
  delete_function_id: Joi.string().allow('', null),
  order_index: Joi.number().required(),
  is_auto_review: Joi.number().valid(0, 1).required(),
  description: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  campaign_type_relevels : Joi.alternatives().when('is_auto_review', {
    is: 0,
    then: Joi.array().required().items(ruleCamtype_Relevel),
  }),
});

const validateRules = {
  createCampaignType: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  updateCampaignType: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  changeStatusCampaignType: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
