const Transform = require('../../common/helpers/transform.helper');

const template = {
  'task_type_id': '{{#? TASKTYPEID}}',
  'task_type_name': '{{#? TYPENAME}}',
  'created_date': '{{#? CREATEDDATE}}',
  'add_function_id': '{{#? ADDFUNCTIONID}}',
  'edit_function_id': '{{#? EDITFUNCTIONID}}',
  'delete_function_id': '{{#? DELETEFUNCTIONID}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_delete': '{{ISDELETED ? 1 : 0}}',
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'task_type_id','task_type_name',
    'description','add_function_id','edit_function_id','delete_function_id', 'is_active',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'task_type_id','task_type_name','created_date',
    'description', 'is_active', 'is_delete',
  ]);
};

const detailUsed = (used = []) => {
  return transform.transform(used, [
    'result','table_used',
  ]);
};

//function
const tempalteFunction={
  'function_id': '{{#? FUNCTIONID}}',
  'function_alias': '{{#? FUNCTIONALIAS}}',
};

let transformFunction = new Transform(tempalteFunction);

const listFunctions = (functions = []) => {
  return transformFunction.transform(functions, [
    'function_id',
  ]);
};
// opt
// options
const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'add': '{{ADD ? 1 : 0}}',
  'edit': '{{EDIT ? 1 : 0}}',
  'delete': '{{DELETE ? 1 : 0}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name','add','edit','delete']);
};
module.exports = {
  list,
  detail,
  detailUsed,
  options,
  listFunctions,
};
