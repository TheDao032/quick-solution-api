const Transform = require('../../common/helpers/transform.helper');

const template = {
  'banner_type_id': '{{#? BANNERTYPEID}}',
  'banner_type_name': '{{#? BANNERTYPENAME}}',
  'descriptions': '{{#? DESCRIPTIONS}}',
  'is_show_home': '{{ISSHOWHOME ? 1 : 0}}',
  'created_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'banner_type_id','banner_type_name','descriptions','is_show_home','is_active','created_date',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'banner_type_id','banner_type_name','descriptions','is_show_home','is_active','created_date',
  ]);
};

module.exports = {
  list,
  detail,
};
