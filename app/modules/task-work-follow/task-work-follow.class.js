const Transform = require('../../common/helpers/transform.helper');

const template = {
  'task_work_follow_id': '{{#? TASKWORKFOLLOWID}}',
  'task_work_follow_name': '{{#? WORKFOLLOWNAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_delete': '{{ISDELETED ? 1 : 0}}',
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'parent_id': '{{#? PARENTID}}',
  'order_index': '{{#? ORDERINDEX}}',
  'description': '{{#? DESCRIPTION}}',
  'is_complete': '{{ISCOMPLETE ? 1 : 0}}',

};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'task_work_follow_id','task_work_follow_name','description',
    'order_index', 'is_active','is_complete',
  ]);
};

const listByType = (areas = []) => {
  return transform.transform(areas, [
    'task_work_follow_id','task_work_follow_name',
    'order_index', 'is_complete',
  ]);
};

const detailUsed = (used = []) => {
  return transform.transform(used, [
    'result','table_used',
  ]);
};

const options = (taskflollows = []) => {
  let transform = new Transform(template);
  return transform.transform(taskflollows, ['id', 'name','parent_id','order_index','description','is_complete','is_active']);
};

module.exports = {
  listByType,
  detail,
  detailUsed,
  options,
};
