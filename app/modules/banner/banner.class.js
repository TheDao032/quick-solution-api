const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'banner_id': '{{#? BANNERID}}',
  'banner_type_id': '{{#? BANNERTYPEID}}',
  'banner_type_name': '{{#? BANNERTYPENAME}}',
  'web_category_id': '{{#? WEBCATEGORYID}}',
  'web_category_name': '{{#? WEBCATEGORYNAME}}',
  'picture_alias': '{{#? PICTUREALIAS}}',
  'picture_url': `${config.domain_cdn}{{PICTUREURL}}`,
  'system_name': '{{#? SYSTEMNAME}}',
  'descriptions': '{{#? DESCRIPTIONS}}',
  'is_slide': '{{ISSLIDE ? 1 : 0}}',
  'created_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'banner_id','banner_type_id','banner_type_name','web_category_id','web_category_name',
    'picture_alias','picture_url','system_name','descriptions','is_slide','is_active','created_date',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'banner_id','banner_type_id','banner_type_name','web_category_id','web_category_name',
    'picture_url','descriptions','is_slide','is_active','created_date',
  ]);
};

const listLocation = (area = []) => {
  let transform = new Transform(templateOption);

  return transform.transform(area, [
    'id','name',
  ]);
};

module.exports = {
  list,
  detail,
  listLocation,
};
