const Transform = require('../../common/helpers/transform.helper');

const template = {
  'business_id': '{{#? BUSINESSID}}',
  'user_id': '{{#? USERID}}',
  'user_name': '{{#? USERNAME}}',
  'full_name': '{{#? FULLNAME}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'position_name': '{{#? POSITIONNAME}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'business_id','user_id','user_name',
    'full_name', 'department_name', 'position_name',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'business_id','user_id','user_name',
    'full_name', 'department_name', 'position_name',
  ]);
};

module.exports = {
  list,
  detail,
};
