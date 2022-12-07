const Joi = require('joi');

const rulePicture =Joi.object().keys({
  picture_url: Joi.string().allow(null,''),
  picture_alias: Joi.string().allow(null,''),
  is_default: Joi.number().valid(0, 1).allow(null),
});
const ruleBusiness =Joi.object().keys({
  business_id: Joi.number().required(),
});
const ruleAttribute =Joi.object().keys({
  product_attribute_id: Joi.number().required(),
  attribute_values: Joi.string().allow(null,''),
});
const ruleCreateOrUpdate = Joi.object().keys({
  product_category_id: Joi.number().required(),
  status_product_id: Joi.number().allow(null),
  product_code: Joi.string().required(),
  product_name: Joi.string().required(),
  product_name_show_web: Joi.string().required(),
  url_product: Joi.string().allow(null,''),
  note: Joi.string().allow(null,''),
  descriptions: Joi.string().allow(null,''),
  product_content_detail: Joi.string().allow(null,''),
  short_description: Joi.string().required(),
  is_show_web: Joi.number().valid(0, 1).required(),
  is_show_home: Joi.number().valid(0, 1).allow(null),
  is_sell_well: Joi.number().valid(0, 1).required(),
  is_high_light: Joi.number().valid(0, 1).required(),
  is_service: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
  pictures: Joi.array().allow(null).items(rulePicture),
  //product
  product_imei: Joi.string().allow(null,''),
  manufacturer_id: Joi.alternatives().when('is_service', {
    is: 0,
    then: Joi.number().required(),
    otherwise: Joi.number().allow(null),
  }),
  lot_number: Joi.string().allow(null,''),
  model_id: Joi.number().allow(null),
  origin_id: Joi.number().allow(null),
  businesses: Joi.array().min(1).required().items(ruleBusiness),
  attribute_values: Joi.alternatives().when('is_service', {
    is: 0,
    then: Joi.array().items(ruleAttribute),
    otherwise: Joi.array().allow(null).items(ruleAttribute),
  }),
  //service
  pt_level_id:Joi.allow(null).when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 1,
      then: Joi.number().allow(null),
    }),
  }),
  values_in:Joi.when('is_service', {
    is: 1,
    then: Joi.number().required(),
  }),
  is_amount_days:Joi.number().valid(0, 1).allow(null),
  is_session:Joi.number().valid(0, 1).allow(null),
  is_freeze:Joi.number().valid(0, 1).allow(null),
  is_tranfer:Joi.number().valid(0, 1).allow(null),
  time_limit:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 1,
      then: Joi.number().required(),
    }),
  }),
  time_per_session:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 1,
      then: Joi.number().required(),
    }),
  }),
  is_apply_sun:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().valid(0, 1).allow(null),
    }),
  }),
  is_apply_mon:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().valid(0, 1).allow(null),
    }),
  }),
  is_apply_tu:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().valid(0, 1).allow(null),
    }),
  }),
  is_apply_we:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().valid(0, 1).allow(null),
    }),
  }),
  is_apply_th:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().valid(0, 1).allow(null),
    }),
  }),
  is_apply_sa:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().valid(0, 1).allow(null),
    }),
  }),
  is_apply_fr:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().valid(0, 1).allow(null),
    }),
  }),
  from_hour:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().allow(null),
    }),
  }),
  to_hour:Joi.when('is_service', {
    is: 1,
    then: Joi.when('is_session', {
      is: 0,
      then: Joi.number().allow(null),
    }),
  }),
});

const rulechangeStatus = {
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createProduct: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  updateProduct:  {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  changeStatusProduct:rulechangeStatus,
};

module.exports = validateRules;

