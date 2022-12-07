const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'customer_type_id': '{{#? CUSTOMERTYPEID}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'customer_type_name': '{{#? CUSTOMERTYPENAME}}',
  'customer_type_group_id': '{{#? CUSTOMERTYPEGROUPID}}',
  'customer_type_group_name': '{{#? CUSTOMERTYPEGROUPNAME}}',
  'color': '{{#? COLOR}}',
  'note_color': '{{#? NOTECOLOR}}',
  'description': '{{#? DESCRIPTION}}',
  'order_index': '{{#? ORDERINDEX}}',
  'is_member_type': '{{ISMEMBERTYPE ? 1 : 0}}',
  'is_sell': '{{ISSELL ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_user_full_name': '{{#? CREATEDUSERFULLNAME}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'type': '{{#? TYPE}}',
};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'customer_type_id','business_id','business_name','customer_type_name','customer_type_group_id',
    'customer_type_group_name','color','note_color','order_index','is_member_type','is_sell',
    'is_system','description','is_active','company_id','company_name','created_user','created_user_full_name','created_date',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'customer_type_id','business_id','business_name','customer_type_name','customer_type_group_id','customer_type_group_name','is_system',
    'type','created_user','created_user_full_name','created_date','is_active','company_name','business_name',
  ]);
};

module.exports = {
  detail,
  list,
};
