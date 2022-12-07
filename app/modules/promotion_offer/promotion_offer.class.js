const Transform = require('../../common/helpers/transform.helper');

const template = {
  'promotion_offer_id': '{{#? PROMOTIONOFFERID}}',
  'promotion_offer_name': '{{#? PROMOTIONOFFERNAME}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'create_date': '{{#? CREATEDDATE}}',
  'order_index': '{{#? ORDERINDEX}}',
  'condition_content': '{{#? CONDITIONCONTENT}}',
  'description': '{{#? DESCRIPTION}}',
  'is_percent_discount': '{{ISPERCENTDISCOUNT ? 1 : 0}}',
  'is_discount_by_set_price': '{{ISDISCOUNTBYSETPRICE ? 1 : 0}}',
  'is_fixed_gift': '{{ISFIXEDGIFT ? 1 : 0}}',
  'is_fix_price': '{{ISFIXPRICE ? 1 : 0}}',
  'discountvalue': '{{#? DISCOUNTVALUE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'product_gifts_id': '{{#? PRODUCTGIFTSID}}',
  'product_code': '{{#? PRODUCTCODE}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'model_id': '{{#? MODELID}}',
  'model_name': '{{#? MODELNAME}}',
  'manufacturer_id': '{{#? MANUFACTURERID}}',
  'manufacturer_name': '{{#? MANUFACTURERNAME}}',
  'product_id': '{{#? PRODUCTID}}',
  'offer_type': '{{#? OFFER_TYPE}}',
  'offer': '{{#? OFFER}}',
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'promotion_offer_id','promotion_offer_name','business_name','business_id','order_index','condition_content','create_date',
    'description','is_percent_discount','is_discount_by_set_price','is_fixed_gift','is_fix_price','discountvalue', 'is_active','is_system','offer',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'promotion_offer_id','promotion_offer_name','business_name','business_id','offer','create_date','offer_type','is_active','is_system',
  ]);
};

const listGift = (areas = []) => {
  return transform.transform(areas, [
    'product_gifts_id','product_code','product_id','product_name','model_id','model_name','manufacturer_id','manufacturer_name',
  ]);
};

const detailUsed = (used = []) => {
  return transform.transform(used, [
    'result','table_used',
  ]);
};

module.exports = {
  list,
  detail,
  detailUsed,
  listGift,
};
