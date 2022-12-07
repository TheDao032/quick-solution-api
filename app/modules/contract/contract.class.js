const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'contract_id': '{{#? CONTRACTID}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'member_id': '{{#? MEMBERID}}',
  'user_name': '{{#? USERNAME}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'customer_code': '{{#? CUSTOMERCODE}}',
  'full_name': '{{#? FULLNAME}}',
  'birth_day': '{{#? BIRTHDAY}}',
  'gender': '{{#? GENDER}}',
  'email': '{{#? EMAIL}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'address_full': '{{#? ADDRESSFULL}}',
  'campaign_id': '{{#? CAMPAIGNID}}',
  'campaign_name': '{{#? CAMPAIGNNAME}}',
  'segment_id': '{{#? SEGMENTID}}',
  'segment_name': '{{#? SEGMENTNAME}}',
  'contract_type_id': '{{#? CONTRACTTYPEID}}',
  'contract_type_name': '{{#? CONTRACTTYPENAME}}',
  'cost_contract': '{{#? COSTCONTRACT}}',
  'relation_ship_member_id': '{{#? RELATIONSHIPMEMBERID}}',
  'relation_ship_member_name': '{{#? RELATIONSHIPMEMBERNAME}}',
  'contract_number': '{{#? CONTRACTNUMBER}}',
  'active_date': '{{#? ACTIVEDATE}}',
  'purpose': '{{#? PURPOSE}}',
  'note_healthy': '{{#? NOTEHEALTHY}}',
  'total_value': '{{#? TOTALVALUE}}',
  'total_month': '{{#? TOTALMONTH}}',
  'pt_name': '{{#? PTNAME}}',
  'contract_status': '{{#? CONTRACTSTATUS}}',
  'user_approved': '{{#? USERAPPROVED}}',
  'date_approved': '{{#? DATEAPPROVED}}',
  'full_name_guardian': '{{#? FULLNAMEGUARDIAN}}',
  'full_address_guardian': '{{#? FULLADDRESSGUARDIAN}}',
  'guardian_id_card': '{{#? GUARDIANIDCARD}}',
  'guardian_email': '{{#? GUARDIANEMAIL}}',
  'guardian_phone_number': '{{#? GUARDIANPHONENUMBER}}',
  'is_agree': '{{ISAGREE ? 1 : 0}}',
  'is_renew': '{{ISRENEW ? 1 : 0}}',
  'start_date_freeze': '{{#? STARTDATEFREEZE}}',
  'end_date_freeze': '{{#? ENDDATEFREEZE}}',
  'document_id': '{{#? DOCUMENTID}}',
  'document_name': '{{#? DOCUMENTNAME}}',
  'freeze_number': '{{#? FREEZENUMBER}}',
  'member_transfer': '{{#? MEMBERTRANFER}}',
  'transfer_number': '{{#? TRANSFERNUMBER}}',
  'member_receive': '{{#? MEMBERRECEIVE}}',
  'transfer_note': '{{#? TRANSFERNOTE}}',
  'is_transfer': '{{ISTRANSFER ? 1 : 0}}',
  'is_freeze': '{{ISFREEZE ? 1 : 0}}',
  'can_transfer': '{{CANTRANSFER ? 1 : 0}}',
  'is_pay': '{{ISPAY}}',
  'is_pay_full': '{{ISPAYFULL}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'contract_id', 'business_id','business_name','company_id','company_name',
    'member_id','data_leads_id','full_name','birth_day','gender','customer_code',
    'address_full','phone_number','email','campaign_name','campaign_id',
    'segment_id','segment_name','contract_type_id','contract_type_name','relation_ship_member_id',
    'relation_ship_member_name','contract_number','active_date','purpose','note_healthy',
    'total_value','total_month','pt_name','user_approved','date_approved','contract_status',
    'full_name_guardian','full_address_guardian','guardian_id_card','guardian_email','guardian_phone_number',
    'is_agree','is_renew','start_date_freeze','end_date_freeze','document_id','document_name',
    'freeze_number','member_transfer','transfer_number','member_receive','transfer_note','is_transfer',
    'is_freeze','is_system',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'contract_id', 'contract_number','contract_type_id','contract_type_name','member_id','user_name',
    'is_renew','business_id','business_name','active_date','is_pay','is_pay_full','total_value',
    'contract_status','created_date','can_transfer',
  ]);
};
const templateDocument = {
  'attachment_name': '{{#? ATTACHMENTNAME}}',
  'attachment_path': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
};

const listDocument = (documents = []) => {
  let transform = new Transform(templateDocument);
  return transform.transform(documents, ['attachment_name', 'attachment_path']);
};
const templateOrder = {
  'order_id': '{{#? ORDERID}}',
  'order_no': '{{#? ORDERNO}}',
  'sub_total': '{{#? SUBTOTAL}}',
  'total_discount': '{{#? TOTALDISCOUNT}}',
  'total_vat': '{{#? TOTALVAT}}',
  'total_money': '{{#? TOTALMONEY}}',
  'order_date': '{{#? ORDERDATE}}',
};

const detailOrder = (order) => {
  let transform = new Transform(templateOrder);
  return transform.transform(order, [
    'order_id', 'order_no', 'sub_total', 'total_discount', 'total_vat', 'total_money', 'order_date',
  ]);
};
const templateOrderDetail = {
  'product_id': '{{#? PRODUCTID}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'product_code': '{{#? PRODUCTCODE}}',
  'output_type_id': '{{#? OUTPUTTYPEID}}',
  'output_type_name': '{{#? OUTPUTTYPENAME}}',
  'promotion_id': '{{#? PROMOTIONID}}',
  'promotion_name': '{{#? PROMOTIONNAME}}',
  'offer': '{{#? OFFER}}',
  'total_discount': '{{#? TOTALDISCOUNT}}',
  'quantity': '{{#? QUANTITY}}',
  'price': '{{#? PRICE}}',
  'vat_amount': '{{#? VATAMOUNT}}',
  'total_amount': '{{#? TOTALAMOUNT}}',
  'promotion_offer_apply_id': '{{#? PROMOTIONOFFERAPPLYID}}',
  'promotion_offer_id': '{{#? PROMOTIONOFFERID}}',
  'promotion_offer_name': '{{#? PROMOTIONOFFERNAME}}',
};
const listOrderDetail = (order_detail = []) => {
  let transform = new Transform(templateOrderDetail);
  return transform.transform(order_detail,[
    'product_id','product_name','product_code', 'output_type_id', 'output_type_name', 'quantity',
    'price', 'vat_amount', 'total_amount','promotion_id','promotion_name','total_discount',
    'promotion_offer_apply_id','promotion_offer_id','promotion_offer_name',
  ]);
};
const listOrderPromotion = (order_detail = []) => {
  let transform = new Transform(templateOrderDetail);
  return transform.transform(order_detail,[
    'product_id', 'promotion_id', 'promotion_name','promotion_offer_apply_id','promotion_offer_id','promotion_offer_name',
  ]);
};
const productInfo = (product_info) => {
  let transform = new Transform(templateOrderDetail);
  return transform.transform(product_info, [
    'product_id', 'product_name', 'promotion_name', 'offer', 'output_type_name','price', 'total_amount','total_discount',
  ]);
};
module.exports = {
  detail,
  list,
  productInfo,
  listDocument,
  detailOrder,
  listOrderDetail,
  listOrderPromotion,
};
