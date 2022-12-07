const Transform = require('../../common/helpers/transform.helper');

const template = {
  'business_type_id': '{{#? BUSINESSTYPEID}}',
  'business_type_name': '{{#? BUSINESSTYPENAME}}',
  'descriptions': '{{#? DESCRIPTIONS}}',
  'security_level_id': '{{#? SECURITYLEVELID}}',
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
    'business_type_id', 'business_type_name', 'descriptions', 'is_active',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'business_type_id', 'business_type_name', 'descriptions', 'is_active', 'created_date',
  ]);
};

module.exports = {
  detail,
  list,
};
