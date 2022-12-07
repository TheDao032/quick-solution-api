const Transform = require('../../common/helpers/transform.helper');
const template = {
  'user_id': '{{#? USERID}}',
  'user_name': '{{#? USERNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'shift': '{{#? SHIFT}}',
  'timekeeping': '{{#? TIMEKEEPING}}',
  'time': '{{#? TIME}}',
  'confirm_time': '{{#? CONFIRMTIME}}',
  'time_keeping_id': '{{#? TIMEKEEPINGID}}',
};

let transform = new Transform(template);

const list = (users = []) => {
  return transform.transform(users, [
    'user_id', 'user_name', 'business_name', 'department_name', 'shift', 'timekeeping', 'time', 'confirm_time', 'time_keeping_id',
  ]);
};

module.exports = {
  list,
};
