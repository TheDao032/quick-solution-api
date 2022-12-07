const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'membership_id': '{{#? MEMBERSHIPID}}',
  'member_id': '{{#? MEMBERID}}',
  'customer_code': '{{#? CUSTOMERCODE}}',
  'full_name': '{{#? FULLNAME}}',
  'birth_day': '{{#? BIRTHDAY}}',
  'gender': '{{#? GENDER}}',
  'martital_status': '{{#? MARITALSTATUS}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'email': '{{#? EMAIL}}',
  'address_full': '{{#? ADDRESSFULL}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'member_type_id': '{{#? MEMBERTYPEID}}',
  'member_type_name': '{{#? MEMBERTYPENAME}}',
  'status_member_id': '{{#? STATUSMEMBERID}}',
  'status_member_name': '{{#? STATUSMEMBERNAME}}',
  'start_date': '{{#? STARTDATE}}',
  'end_date': '{{#? ENDDATE}}',
  'note': '{{#? NOTE}}',
  'is_member_all_company': '{{ISMEMBERALLCOMPANY ? 1 : 0}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

const detail = (membership) => {
  let transform = new Transform(template);

  return transform.transform(membership, [
    'membership_id','member_id', 'full_name','birth_day',
    'gender','martital_status','phone_number', 'email',
    'company_id','company_name','business_id', 'business_name',
    'member_type_id','member_type_name','status_member_id', 'status_member_name',
    'start_date','end_date','note', 'is_member_all_company','is_active',
  ]);
};
const list = (membership = []) => {
  let transform = new Transform(template);

  return transform.transform(membership, [
    'membership_id','member_id', 'customer_code','full_name',
    'gender','birth_day','phone_number', 'is_active','address_full',
    'business_id','business_name', 'status_member_id','status_member_name',
  ]);
};
const templateAccount = {
  'member_id': '{{#? MEMBERID}}',
  'user_name': '{{#? USERNAME}}',
  'password': '{{#? PASSWORD}}',
  'customer_code': '{{#? CUSTOMERCODE}}',
  'type_register': '{{#? TYPEREGISTER}}',
  'register_date': '{{#? REGISTERDATE}}',
  'image_avatar': `${config.domain_cdn}{{IMAGEAVATAR}}`,
  'full_name': '{{#? FULLNAME}}',
  'birth_day': '{{#? BIRTHDAY}}',
  'gender': '{{#? GENDER}}',
  'marital_status': '{{#? MARITALSTATUS}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'email': '{{#? EMAIL}}',
  'id_card': '{{#? IDCARD}}',
  'id_card_date': '{{#? IDCARDDATE}}',
  'id_card_place': '{{#? IDCARDPLACE}}',
  'address': '{{#? ADDRESS}}',
  'address_full': '{{#? ADDRESSFULL}}',
  'province_id': '{{#? PROVINCEID}}',
  'province_name': '{{#? PROVINCENAME}}',
  'district_id': '{{#? DISTRICTID}}',
  'district_name': '{{#? DISTRICTNAME}}',
  'country_id': '{{#? COUNTRYID}}',
  'country_name': '{{#? COUNTRYNAME}}',
  'ward_id': '{{#? WARDID}}',
  'ward_name': '{{#? WARDNAME}}',
  'is_confirm': '{{ISCONFIRM ? 1 : 0}}',
  'is_notification': '{{ISNOTIFICATION ? 1 : 0}}',
  'is_can_email': '{{ISCANEMAIL ? 1 : 0}}',
  'is_can_sms_or_phone': '{{ISCANSMSORPHONE ? 1 : 0}}',
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
const detailAccount = (account) => {
  let transform = new Transform(templateAccount);
  return transform.transform(account, [
    'member_id', 'user_name','password','customer_code','type_register',
    'register_date','image_avatar','full_name','birth_day','gender',
    'marital_status','phone_number','email','id_card','id_card_date',
    'id_card_place','address','province_id','province_name','district_id',
    'district_name','country_id','country_name','ward_id','ward_name',
    'is_confirm','is_notification','is_can_email','is_system','is_active','is_can_sms_or_phone',
  ]);
};

const templateContract = {
  'contract_id': '{{#? CONTRACTID}}',
  'contract_number': '{{#? CONTRACTNUMBER}}',
  'contract_type_id': '{{#? CONTRACTTYPEID}}',
  'contract_type_name': '{{#? CONTRACTTYPENAME}}',
  'total_value': '{{#? TOTALVALUE}}',
  'active_date': '{{#? ACTIVEDATE}}',
  'end_date': '{{#? ENDDATE}}',
};
const listContract = (contract= []) => {
  let transform = new Transform(templateContract);
  return transform.transform(contract, [
    'contract_number', 'contract_type_id','contract_type_name','total_value',
    'active_date','end_date','contract_id',
  ]);
};

const templateHistory = {
  'history_membership_id': '{{#? HISTORYMEMBERSHIPID}}',
  'membership_id': '{{#? MEMBERSHIPID}}',
  'member_id': '{{#? MEMBERID}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'status_member_id': '{{#? STATUSMEMBERID}}',
  'status_member_name': '{{#? STATUSMEMBERNAME}}',
  'start_date': '{{#? STARTDATE}}',
  'is_pt_contract': '{{ISPTCONTRACT ? 1 : 0}}',
  'is_freeze': '{{ISFREEZE ? 1 : 0}}',
  'is_contract_tranfer': '{{ISCONTRACTTRANFER ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
};
const listHistory = (history= []) => {
  let transform = new Transform(templateHistory);
  return transform.transform(history, [
    'history_membership_id', 'membership_id','member_id','business_id',
    'business_name','status_member_id','status_member_name','start_date',
    'is_pt_contract','is_freeze','is_contract_tranfer','created_user','created_date',
  ]);
};
module.exports = {
  detail,
  list,
  detailAccount,
  listContract,
  listHistory,
};
