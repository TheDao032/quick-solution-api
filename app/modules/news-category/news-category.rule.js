const Joi = require('joi');

const rulePicture =Joi.object().keys({
  picture_url: Joi.string().allow(null,''),
  picture_alias: Joi.string().allow(null,''),
  is_default: Joi.number().valid(0, 1).allow(null),
});

const ruleCreateOrUpdate = {
  parent_id: Joi.number().required(),
  news_category_name: Joi.string().required(),
  description: Joi.string().allow('', null),
  meta_key_words:Joi.string().allow('', null),
  meta_descriptions: Joi.string().allow('', null),
  meta_title: Joi.string().allow('', null),
  seo_name: Joi.string().allow('', null),
  category_level: Joi.number().allow(null),
  image_file_id: Joi.string().allow('', null),
  is_cate_video: Joi.number().valid(0, 1).required(),
  order_index: Joi.number().required(),
  is_active: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
  pictures: Joi.string().required(),
};

const validateRules = {
  createNewsCategory: {
    body: ruleCreateOrUpdate,
  },
  updateNewsCategory: {
    body: ruleCreateOrUpdate,
  },
  changeStatusNewsCategory: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  checkOrderIndex: {
    body: {
      order_index: Joi.number().required(),
    },
  },
};

module.exports = validateRules;
