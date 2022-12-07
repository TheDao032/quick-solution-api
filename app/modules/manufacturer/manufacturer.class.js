const Transform = require('../../common/helpers/transform.helper');

const template = {
  'manufacturer_id': '{{#? MANUFACTURERID}}',
  'manufacturer_name': '{{#? MANUFACTURERNAME}}',
  'manufacturer_address': '{{#? MANUFACTURERADDRESS}}',
  'email': '{{#? EMAIL}}',
  'website': '{{#? WEBSITE}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'descriptions': '{{#? DESCRIPTIONS}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_user_full_name': '{{#? CREATEDUSERFULLNAME}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const options = (manufacturer = []) => {
  let transform = new Transform(templateOptions);

  return transform.transform(manufacturer, ['id', 'name']);
};
const detail = (manufacturer) => {
  let transform = new Transform(template);

  return transform.transform(manufacturer, [
    'manufacturer_id','manufacturer_name', 'manufacturer_address','email'
    ,'website','phone_number','descriptions', 'is_active',
  ]);
};

const list = (manufacturer = []) => {
  let transform = new Transform(template);

  return transform.transform(manufacturer, [
    'manufacturer_id','manufacturer_name', 'manufacturer_address','email'
    ,'website','phone_number','created_user_full_name', 'is_active','is_deleted',
  ]);
};

module.exports = {
  options,
  detail,
  list,
};
