const Joi = require('joi');

const itemsArray = Joi.object().keys({
  product_attribute_id:Joi.number().required(),
});
const ruleCreateOrUpdate = Joi.object().keys({
  company_id: Joi.number().required(),
  category_name:Joi.string().required(),
  name_show_web: Joi.string().required(),
  seo_name: Joi.string().required(),
  add_function_id: Joi.string().required(),
  edit_function_id: Joi.string().required(),
  delete_function_id:Joi.string().required(),
  view_function_id: Joi.string().required(),
  icon_url: Joi.string().required(),
  parent_id: Joi.number().allow('', null),
  description:Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
  list_attribute: Joi.array().min(1).items(itemsArray),
});


const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
  },
  update: {
    body: ruleCreateOrUpdate,
  },
  changeStatus: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
