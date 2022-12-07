const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'member_id': '{{#? MEMBERID}}',
  'user_name': '{{#? USERNAME}}',
  'password': '{{#? PASSWORD}}',
  'customer_code': '{{#? CUSTOMERCODE}}',
  'type_register': '{{#? TYPEREGISTER}}',
  'register_date': '{{#? REGISTERDATE}}',
  'image_avatar': `${config.domain_cdn}{{IMAGEAVATAR}}`,
  'full_name': '{{#? FULLNAME}}',
  'birth_day': '{{#? BIRTHDAY}}',
  'gender': '{{GENDER ? 1 : 0}}',
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

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'member_id', 'user_name','password','customer_code','type_register',
    'register_date','image_avatar','full_name','birth_day','gender',
    'marital_status','phone_number','email','id_card','id_card_date',
    'id_card_place','address','province_id','province_name','district_id',
    'district_name','country_id','country_name','ward_id','ward_name',
    'is_confirm','is_notification','is_can_email','is_system','is_active','is_can_sms_or_phone',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'member_id', 'customer_code','full_name','gender','birth_day','phone_number',
    'address_full','type_register','is_active',
  ]);
};
// options
const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name']);
};
module.exports = {
  detail,
  list,
  options,
};
