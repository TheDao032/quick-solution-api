const Joi = require('joi');

const ruleBookingDetailCreateOrUpdate = {
  booking_detail_id: Joi.number().allow(null),
  product_id: Joi.number().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  total_price_item: Joi.number().allow(null),
};

const ruleBookingCreateOrUpdate = {
  booking_id: Joi.number().required(),
  booking_status_id: Joi.number().allow(null),
  //total_money: Joi.string().required(),
  note:Joi.string().allow('', null),
  list_booking_detail: Joi.array().min(1).items(ruleBookingDetailCreateOrUpdate),
};

const ruleListBookingDetailCreateOrUpdate = {
  cookie_id: Joi.string().required(),
  booking_id: Joi.number().required(),
};

const ruleCartCreateOrUpdate = {
  member_id: Joi.number().allow(null),
  cookie_id: Joi.string().allow('', null),
  product_id: Joi.number().required(),
  quantity: Joi.number().allow(null),
  price: Joi.number().allow(null),
  total_price_item: Joi.number().allow(null),
};

const ruleOrderCreateOrUpdate = {
  order_id: Joi.number().allow(null),
  //business_id: Joi.number().required(),
  //contract_id: Joi.number().allow(null),
  //is_contract_order: Joi.number().valid(0, 1).allow(null),
  booking_id: Joi.number().required(),
  //order_no: Joi.string().allow('', null),
  //member_id: Joi.number().allow(null),
  //sub_total: Joi.number().required(),
  //total_discount: Joi.number().required(),
  //total_vat: Joi.number().required(),
  //total_money: Joi.number().required(),
  //order_date: Joi.string().required(),
  //note: Joi.string().allow('', null),
};

const ruleOrderDetailCreateOrUpdate = {
  order_detail_id: Joi.number().allow(null),
  order_id: Joi.number().required(),
  product_id: Joi.number().required(),
  out_put_type_id: Joi.string().allow('', null),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  total_amount: Joi.number().required(),
  vat_amount: Joi.number().required(),
};

const ruleOrderPromotionCreateOrUpdate = {
  order_promotion_id: Joi.number().allow(null),
  order_id: Joi.number().required(),
  promotion_id: Joi.number().required(),
  product_id: Joi.number().required(),
  promotion_offer_apply_id: Joi.number().allow(null),
  product_gifts_id: Joi.number().allow(null),
};

const validateRules = {
  updateBooking: {
    body: ruleBookingCreateOrUpdate,
  },
  insertListBookingDetail:{
    body: ruleListBookingDetailCreateOrUpdate,
  },
  insertCart:{
    body: ruleCartCreateOrUpdate,
  },
  changeStatus: {
    body: {
      booking_status_id: Joi.number().allow(null),
    },
  },
  insertOrder:{
    body: ruleOrderCreateOrUpdate,
  },
  insertOrderDetail:{
    body: ruleOrderDetailCreateOrUpdate,
  },
  insertOrderPromotion:{
    body: ruleOrderPromotionCreateOrUpdate,
  },
};

module.exports = validateRules;
