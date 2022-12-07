const Joi = require('joi');

const setupServiceCreateOrUpdate = {
  setup_service_id: Joi.number().allow(null),
  webcategory_id: Joi.number().required(),
  category_name: Joi.string().allow('',null),
  setup_service_title: Joi.string().required(),
  content: Joi.string().allow('', null),
  meta_key_words: Joi.string().allow('', null),
  meta_descriptions: Joi.string().allow('', null),
  meta_title: Joi.string().allow('', null),
  seo_name: Joi.string().allow('', null),
  system_name_setup: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  short_description: Joi.string().allow('', null),
  image_url: Joi.string().allow('', null),
  small_thumbnail_image_file_id: Joi.string().allow('', null),
  small_thumbnail_image_url: Joi.string().allow('', null),
  medium_thumbnail_image_file_id: Joi.string().allow('', null),
  medium_thumbnail_image_url: Joi.string().allow('', null),
  large_thumbnail_image_file_id: Joi.string().allow('', null),
  large_thumbnail_image_url: Joi.string().allow('', null),
  xlarge_thumbnail_image_file_id: Joi.string().allow('', null),
  xlarge_thumbnail_image_url: Joi.string().allow('', null),
  is_show_home: Joi.number().valid(0, 1).required(),
  is_system: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
  is_service_package: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createSetupService: {
    body: setupServiceCreateOrUpdate,
  },
  updateSetupService: {
    body: setupServiceCreateOrUpdate,
  },
  changeSetupService: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
