const Transform = require('../../common/helpers/transform.helper');

const template = {
  'news_status_id': '{{#? NEWSSTATUSID}}',
  'news_status_name': '{{#? NEWSSTATUSNAME}}',
  'description': '{{#? DESCRIPTION}}',
  'order_index': '{{#? ORDERINDEX}}',
  'user': '{{#? USER}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'news_status_id','news_status_name','description','order_index','create_date','is_active','is_system',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'news_status_id','news_status_name','user','create_date','is_active',
  ]);
};

const listAll = (area = []) => {
  let transform = new Transform(templateOption);

  return transform.transform(area, [
    'id','name',
  ]);
};

module.exports = {
  list,
  listAll,
  detail,
};
