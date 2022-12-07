const Transform = require('../../common/helpers/transform.helper');

const template = {
  'static_content_id': '{{#? STATICCONTENTID}}',
  'static_title': '{{#? STATICTITLE}}',
  'system_name': '{{#? SYSTEMNAME}}',
  'webcategory_id': '{{#? WEBCATEGORYID}}',
  'category_name': '{{#? CATEGORYNAME}}',
  'static_content': '{{#? STATICCONTENT}}',
  'meta_data_scriptions': '{{#? METADESCRIPTIONS}}',
  'meta_keywords': '{{#? METAKEYWORDS}}',
  'meta_title': '{{#? METATITLE}}',
  'seo_name': '{{#? SEONAME}}',
  'display_order': '{{#? DISPLAYORDER}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_childrent': '{{ISCHILDRENT ? 1 : 0}}',
  'create_date': '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'static_content_id','static_title','system_name','webcategory_id','category_name','static_content','meta_data_scriptions',
    'meta_keywords','meta_title', 'seo_name', 'display_order','is_active','is_childrent',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'static_content_id','static_title','static_content','system_name','webcategory_id','category_name','is_childrent',
    'is_active','create_date',
  ]);
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const listAll = (area = []) => {
  let transform = new Transform(templateOption);

  return transform.transform(area, [
    'id','name',
  ]);
};

module.exports = {
  list,
  detail,
  listAll,
};
