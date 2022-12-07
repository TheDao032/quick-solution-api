const Joi = require('joi');
const rulerOrderDetail = Joi.object().keys({
  product_id: Joi.number().required(),
  output_type_id: Joi.number().required(),
  promotion_id: Joi.number().allow(null),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  total_discount: Joi.number().required(),
  vat_amount: Joi.number().required(),
  total_amount: Joi.number().required(),
});
const rulerDocument = Joi.object().keys({
  attachment_name: Joi.string().required(),
  attachment_path: Joi.string().required(),
});
const ruleCreateOrUpdate = Joi.object().keys({
  business_id: Joi.number().required(),
  member_id: Joi.number().allow('', null),
  contract_type_id: Joi.number().required(),
  is_renew: Joi.number().valid(0, 1).required(),
  total_value: Joi.number().required(),
  active_date:Joi.string().required(),
  data_leads_id:Joi.string().required(),
  note_healthy: Joi.string().allow('', null),
  purpose: Joi.string().allow('', null),
  is_agree: Joi.number().allow('', null).valid(0, 1),
  full_name_guardian:Joi.string().allow('',null),
  relation_ship_member_id:Joi.number().allow(null),
  full_address_guardian:Joi.string().allow('', null),
  guardian_email:Joi.string().allow('', null),
  guardian_id_card:Joi.string().allow('', null),
  guardian_phone_number:Joi.string().allow('', null),
  order_id: Joi.number().allow(null),
  sub_total: Joi.number().required(),
  total_vat: Joi.number().required(),
  total_discount: Joi.number().required(),
  total_money: Joi.number().required(),
  order_detais: Joi.array().allow(null).items(rulerOrderDetail),
});

const validateRules = {
  createContract: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  updateContract: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  approvedContract: {
    body: {
      contract_status: Joi.number().valid(0, 1).required(),
    },
  },
  transferContract: {
    body: {
      member_transfer: Joi.number().required(),
      member_receive: Joi.number().required(),
      transfer_note:Joi.string().allow('', null),
    },
  },
  freezeContract: {
    body: {
      start_date_freeze: Joi.string().required(),
      end_date_freeze: Joi.string().required(),
      document_id:Joi.number().required(),
      documents:Joi.array().allow(null).items(rulerDocument),
    },
  },
};

module.exports = validateRules;
