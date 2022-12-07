const Joi = require('joi');

const ruleCreateOrUpdate = {
  product_id: Joi.number().required(),
  price: Joi.required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
};

const validateRules = {
  createPrice: {
    body: ruleCreateOrUpdate,
  },
  updatePrice: {
    body: ruleCreateOrUpdate,
  },
  changeStatusPrice: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  approvedPriceReviewList: {
    body: {
      price_apply_review_level_id: Joi.number().required(),
      is_review: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
