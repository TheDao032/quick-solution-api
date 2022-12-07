const Transform = require('../../common/helpers/transform.helper');

const template = {
  'topic_id': '{{#? TOPICID}}',
  'topic_name': '{{#? TOPICNAME}}',
  'descriptions': '{{#? DESCRIPTIONS}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'topic_id','topic_name','descriptions','is_active','create_date',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'topic_id','topic_name','descriptions','create_date','is_active',
  ]);
};

module.exports = {
  list,
  detail,
};
