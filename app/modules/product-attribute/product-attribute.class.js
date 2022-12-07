const Transform = require('../../common/helpers/transform.helper');

const template = {
  'product_attribute_id': '{{#? PRODUCTATTRIBUTEID}}',
  'unit_id': '{{#? UNITID}}',
  'unit_name': '{{#? UNITNAME}}',
  'attribute_name': '{{#? ATTRIBUTENAME}}',
  'attribute_description': '{{#? ATTRIBUTEDESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};
const detail = (product) => {
  let transform = new Transform(template);

  return transform.transform(product, [
    'product_attribute_id','unit_id', 'unit_name','attribute_name','attribute_description',
    'is_active','created_date',
  ]);
};

const list = (products = []) => {
  let transform = new Transform(template);

  return transform.transform(products, [
    'product_attribute_id','unit_id', 'unit_name','attribute_name','attribute_description',
    'is_active','created_date','is_deleted',
  ]);
};

const templateAttributeValues = {
  'attribute_values_id': '{{#? ATTRIBUTEVALUESID}}',
  'attribute_values': '{{#? ATTRIBUTEVALUES}}',
  'product_attribute_id': '{{#? PRODUCTATTRIBUTEID}}',
  'attribute_description': '{{#? ATTRIBUTEDESCRIPTION}}',
};
const listAttributeValues = (attributeValues=[]) => {
  let transform = new Transform(templateAttributeValues);
  return transform.transform(attributeValues, [
    'attribute_values_id','attribute_values', 'product_attribute_id', 'attribute_description',
  ]);
};

const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const options = (manufacturer = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(manufacturer, ['id', 'name']);
};


module.exports = {
  options,
  detail,
  list,
  listAttributeValues,
};
