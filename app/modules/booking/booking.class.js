const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const templateBooking = {
  'booking_id': '{{#? BOOKINGID}}',
  'dataleads_id': 'DATALEADSID',
  'member_id': '{{#? MEMBERID}}',
  'booking_no': '{{#? BOOKINGNO}}',
  'booking_status_id': '{{#? BOOKINGSTATUSID}}',
  'status_name': '{{#? STATUSNAME}}',
  'booking_date': '{{#? BOOKINGDATE}}',
  'note': '{{#? NOTE}}',
  'full_name': '{{#? FULLNAME}}',
  'email': '{{#? EMAIL}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'country_id': '{{#? COUNTRYID}}',
  'province_id': '{{#? PROVINCEID}}',
  'province_name': '{{#? PROVINCENAME}}',
  'district_id': '{{#? DISTRICTID}}',
  'district_name': '{{#? DISTRICTNAME}}',
  'ward_id': '{{#? WARDID}}',
  'ward_name': '{{#? WARDNAME}}',
  'address': '{{#? ADDRESS}}',
  'full_address': '{{#? FULLADDRESS}}',
  'sub_total': '{{#? SUBTOTAL}}',
  'total_discount': '{{#? TOTALDISCOUNT}}',
  'total_money': '{{#? TOTALMONEY}}',
  'user': '{{#? USER}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

const templateProduct = {
  'product_id': '{{#? PRODUCTID}}',
  'manufacturer_name': '{{#? MANUFACTURERNAME}}',
  'product_code': '{{#? PRODUCTCODE}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'model_name': '{{#? MODELNAME}}',
  'price': '{{#? PRICE}}',
  'quantity': '{{#? QUANTITY}}',
  'is_service': '{{ISSERVICE ? 1 : 0}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'user': '{{#? USER}}',
  'created_date': '{{#? CREATEDDATE}}',
};

const templateBookingDetail = {
  'booking_detail_id': '{{#? BOOKINGDETAILID}}',
  'product_id': '{{#? PRODUCTID}}',
  'product_code': '{{#? PRODUCTCODE}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'quantity': '{{#? QUANTITY}}',
  'price': '{{#? PRICE}}',
  'vat': '{{#? VAT}}',
  'discount_value': '{{DISCOUNTVALUE}}',
  'is_promotion': '{{ISPROMOTION ? 1 : 0}}',
  'total_price_item': '{{#? TOTALPRICEITEM}}',
};

const templateOrder = {
  'order_id': '{{#? ORDERID}}',
  'business_id': '{{#? BUSINESSID}}',
  'contract_id': '{{#? CONTRACTID}}',
  'is_contract_order': '{{#? ISCONTRACTORDER}}',
  'booking_id': '{{#? BOOKINGID}}',
  'order_no': '{{#? ORDERNO}}',
  'member_id': '{{#? MEMBERID}}',
  'sub_total': '{{#? SUBTOTAL}}',
  'total_discount': '{{#? TOTALDISCOUNT}}',
  'total_vat': '{{#? TOTALVAT}}',
  'total_money': '{{#? TOTALMONEY}}',
  'order_date': '{{#? ORDERDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'user': '{{#? USER}}',
  'created_date': '{{#? CREATEDDATE}}',
};

const templateOrderDetail = {
  'order_detail_id': '{{#? ORDERDETAILID}}',
  'order_id': '{{#? ORDERID}}',
  'product_id': '{{#? PRODUCTID}}',
  'out_put_type_id': '{{#? OUTPUTTYPEID}}',
  'quantity': '{{#? QUANTITY}}',
  'price': '{{#? PRICE}}',
  'total_amount': '{{#? TOTALAMOUNT}}',
  'vat_amount': '{{#? VATAMOUNT}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'user': '{{#? USER}}',
  'created_date': '{{#? CREATEDDATE}}',
};

const templateOrderPromotion = {
  'order_promotion_id': '{{#? ORDERPROMOTIONID}}',
  'order_id': '{{#? ORDERID}}',
  'promotion_id': '{{#? PROMOTIONID}}',
  'product_id': '{{#? PRODUCTID}}',
  'promotion_offer_apply_id': '{{#? PROMOTIONOFFERAPPLYID}}',
  'product_gifts_id': '{{#? PRODUCTGIFTSID}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'user': '{{#? USER}}',
  'created_date': '{{#? CREATEDDATE}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

let transform = new Transform(templateBooking);

const detail = (area) => {
  return transform.transform(area, [
    'booking_id','member_id','booking_no','booking_date','booking_status_id','status_name','note','full_name','phone_number',
    'email','address', 'ward_id', 'ward_name','district_id','district_name','province_id','full_address','province_name','sub_total', 'total_discount', 'total_money', 'is_active','create_date',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'booking_id','dataleads_id','booking_no','full_name','phone_number','email','total_money','booking_date','status_name',
    'user','create_date',
  ]);
};

const listProduct = (area = []) => {
  let transform = new Transform(templateProduct);

  return transform.transform(area, [
    'province_id','product_code','product_name','model_name','manufacturer_name','price','quantity','is_service',
  ]);
};

const listBookingDetail = (area = []) => {
  let transform = new Transform(templateBookingDetail);

  return transform.transform(area, [
    'booking_detail_id','product_id','product_code','product_name','quantity','price','vat','discount_value','is_promotion','total_price_item',
  ]);
};

const listAll = (area = []) => {
  let transform = new Transform(templateOption);

  return transform.transform(area, [
    'id','name',
  ]);
};

module.exports = {
  list,
  detail,
  listProduct,
  listAll,
  listBookingDetail,
};
