const Transform = require('../../common/helpers/transform.helper');

const template = {
  'web_category_id': '{{#? WEBCATEGORYID}}',
  'website_id': '{{#? WEBSITEID}}',
  'website_name': '{{#? WEBSITENAME}}',
  'category_name': '{{#? CATEGORYNAME}}',
  'cate_parent_id': '{{#? CATEPARENTID}}',
  'cate_parent_name': '{{#? CATEPARENTNAME}}',
  'url_category': '{{#? URLCATEGORY}}',
  'description': '{{#? DESCRIPTION}}',
  'user': '{{#? USER}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'parent_id': '{{#? PARENTID}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

const templateWebsite = {
  'website_id': '{{#? WEBSITEID}}',
  'website_name': '{{#? WEBSITENAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'web_category_id','category_name','cate_parent_id','website_id','website_name','url_category','description','is_active',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'web_category_id','category_name','cate_parent_name','website_name','url_category','is_active','create_date','user',
  ]);
};

const listAll = (area = []) => {
  let transform = new Transform(templateOption);

  return transform.transform(area, [
    'id','name',
  ]);
};

let transformWeb = new Transform(templateWebsite);
const detailWebsite = (area) => {
  return transformWeb.transform(area, [
    'website_id', 'website_name','is_active',
  ]);
};

const templateCategoryName = {
  'product_category_id': '{{#? PRODUCTCATEGORYID}}',
  'category_name': '{{#? CATEGORYNAME}}',

};
const listCategoryName = (pictures = []) => {
  let transform = new Transform(templateCategoryName);
  return transform.transform(pictures, [
    'product_category_id','category_name',
  ]);
};

const templateNewsCategoryName = {
  'news_category_id': '{{#? NEWSCATEGORYID}}',
  'news_category_name': '{{#? NEWSCATEGORYNAME}}',

};
const listNewsCategoryName = (pictures = []) => {
  let transform = new Transform(templateNewsCategoryName);
  return transform.transform(pictures, [
    'news_category_id','news_category_name',
  ]);
};

const templateManufacturerName = {
  'manufacture_id': '{{#? MANUFACTURERID}}',
  'manufacture_name': '{{#? MANUFACTURERNAME}}',

};
const listManufacturerName = (pictures = []) => {
  let transform = new Transform(templateManufacturerName);
  return transform.transform(pictures, [
    'manufacture_id','manufacture_name',
  ]);
};

module.exports = {
  list,
  detail,
  listAll,
  detailWebsite,
  listCategoryName,
  listNewsCategoryName,
  listManufacturerName,
};
