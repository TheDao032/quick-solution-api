const Joi = require('joi');

const ruleProductCategory = {
  product_category_id: Joi.number().required(),
};

const ruleNewsCategory = {
  news_category_id: Joi.number().required(),
};

const ruleManufacture = {
  manufacture_id: Joi.number().required(),
};


const websiteCategoryCreateOrUpdate = {
  website_id: Joi.number().required(),
  category_name: Joi.string().allow('', null),
  cate_parent_id:Joi.number().allow(null),
  url_category:Joi.string().allow('', null),
  description:Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  list_product_category: Joi.array().allow(null).items(ruleProductCategory),
  list_news_category: Joi.array().allow(null).items(ruleNewsCategory),
  list_manufacture: Joi.array().allow(null).items(ruleManufacture),
};

const validateRules = {
  createWebsiteCategory: {
    body: websiteCategoryCreateOrUpdate,
  },
  updateWebsiteCategory: {
    body: websiteCategoryCreateOrUpdate,
  },
  changeStatusWebsiteCategory: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
