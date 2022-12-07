const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'task_id': '{{#? TASKID}}',
  'task_name': '{{#? TASKNAME}}',
  'task_type_id': '{{#? TASKTYPEID}}',
  'task_type_name': '{{#? TYPENAME}}',
  'start_date': '{{#? STARTDATE}}',
  'end_date': '{{#? ENDDATE}}',
  'parent_id': '{{#? PARENTID}}',
  'parent_name': '{{#? PARENTNAME}}',
  'user_name': '{{#? USERNAME}}',
  'full_name': '{{#? FULLNAME}}',
  'user_id': '{{#? USERID}}',
  'supervisor_name': '{{#? SUPERVISORNAME}}',
  'supervisor_full_name': '{{#? SUPERVISORFULLNAME}}',
  'count_dataleads_complete': '{{#? COUNTDATALEADSCOMPLETE}}',
  'department_id': '{{#? DEPARTMENTID}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_id':'{{#? BUSINESSID}}',
  'business_name':'{{#? BUSINESSNAME}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_completed': '{{ISCOMPLETED ? 1 : 0}}',
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',
  'default_picture_url': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
  'supervisor_default_picture_url': `${config.domain_cdn}{{SUPERVISORDEFAULTPICTUREURL}}`,
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'task_id','task_name','task_type_id','task_type_name','start_date','end_date','parent_id','parent_name',
    'description','user_name','full_name','user_id','default_picture_url','supervisor_name','supervisor_full_name','supervisor_default_picture_url',
    'department_id','department_name','company_id','company_name','business_id','business_name','is_active','is_completed',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'task_id','task_name','task_type_name','start_date','end_date',
    'full_name','supervisor_full_name','count_dataleads_complete', 'is_active', 'is_completed','parent_id',
  ]);
};

const listDataleads = (list = []) => {
  return transform.transform(list, [
    'datalead_id','full_name_customer','gender','birth_day','phone_number','email',
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
  listDataleads,
  detailUsed,
  options,
  listFunctions,
};
