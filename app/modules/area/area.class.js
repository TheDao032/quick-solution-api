const Transform = require('../../common/helpers/transform.helper');

const template = {
  'area_id': '{{#? AREAID}}',
  'area_name': '{{#? AREANAME}}',
  'created_date': '{{#? CREATEDDATE}}',
  'description': '{{#? DESCRIPTIONS}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_delete': '{{ISDELETED ? 1 : 0}}',
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'area_id','area_name','created_date',
    'description', 'is_active',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'area_id','area_name','created_date',
    'description', 'is_active', 'is_delete',
  ]);
};

const detailUsed = (used = []) => {
  return transform.transform(used, [
    'result','table_used',
  ]);
};

module.exports = {
  list,
  detail,
  detailUsed,
};
