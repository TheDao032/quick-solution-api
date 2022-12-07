const Transform = require('../../common/helpers/transform.helper');

const template = {
  'city_id': '{{#? CITYID}}',
  'city_name': '{{#? CITYNAME}}',
  'keywords': '{{#? KEYWORDS}}',
  'zip_code': '{{#? ZIPCODE}}',
  'state_id': '{{#? STATEID}}',
  'is_active': '{{#? ISACTIVE}}',
  'priority': '{{#? PRIORITY}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

module.exports = {
  options,
};
