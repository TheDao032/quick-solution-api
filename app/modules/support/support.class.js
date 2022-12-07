const Transform = require('../../common/helpers/transform.helper');

const template = {
  'support_id': '{{#? SUPPORTID}}',
  'full_name': '{{#? FULLNAME}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'email': '{{#? EMAIL}}',
  'content_support': '{{#? CONTENTSUPPORT}}',
  'topic_id': '{{#? TOPICID}}',
  'topic_name': '{{#? TOPICNAME}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'support_id','full_name','phone_number','email','content_support','topic_id','topic_name','is_active','create_date',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'support_id','full_name','phone_number','email','content_support','topic_id','topic_name','is_active',
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
  detail,
  listAll,
};
