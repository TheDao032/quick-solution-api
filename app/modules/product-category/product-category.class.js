const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'product_category_id': '{{#? PRODUCTCATEGORYID}}',
  'category_name': '{{#? CATEGORYNAME}}',
  'is_show_web': '{{ISSHOWWEB ? 1 : 0}}',
  'name_show_web': '{{#? NAMESHOWWEB}}',
  'seo_name': '{{#? SEONAME}}',
  'parent_id': '{{#? PARENTID}}',
  'parent_name': '{{#? PARENTNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'description': '{{#? DESCRIPTIONS}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_full_name': '{{#? CREATEDFULLNAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'view_function_id': '{{#? VIEWFUNCTIONID}}',
  'add_function_id': '{{#? ADDFUNCTIONID}}',
  'edit_function_id': '{{#? EDITFUNCTIONID}}',
  'delete_function_id': '{{#? DELETEFUNCTIONID}}',
  'icon_url': `${config.domain_cdn}{{ICONURL}}`,
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',
  'product_attribute_id': '{{#? PRODUCTATTRIBUTEID}}',
  'attribute_name': '{{#? ATTRIBUTENAME}}',
  'unit_id': '{{#? UNITID}}',
  'unit_name': '{{#? UNITNAME}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'product_category_id','category_name','is_show_web','name_show_web','seo_name','parent_id','parent_name','company_id','company_name',
    'created_full_name', 'is_active','description','icon_url','view_function_id','add_function_id','edit_function_id','delete_function_id',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'product_category_id','category_name','name_show_web','seo_name','parent_name','company_name',
    'created_full_name', 'is_active',
  ]);
};
const listAttributeByCategory = (areas = []) => {
  return transform.transform(areas, [
    'product_attribute_id','attribute_name','unit_id','unit_name',
  ]);
};


const detailUsed = (used = []) => {
  return transform.transform(used, [
    'result','table_used',
  ]);
};

//function
const tempalteFunction={
  'function_id': '{{#? FUNCTIONID}}',
  'function_alias': '{{#? FUNCTIONALIAS}}',
};

let transformFunction = new Transform(tempalteFunction);

const listFunctions = (functions = []) => {
  return transformFunction.transform(functions, [
    'function_id',
  ]);
};
// opt
// options
const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'parent_id':'{{#? PARENTID}}',
  'add': '{{ADD ? 1 : 0}}',
  'edit': '{{EDIT ? 1 : 0}}',
  'delete': '{{DELETE ? 1 : 0}}',
  'view': '{{VIEW ? 1 : 0}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name','parent_id','add','edit','delete','view']);
};
module.exports = {
  list,
  detail,
  detailUsed,
  options,
  listFunctions,
  listAttributeByCategory,
};
