const Transform = require('../../common/helpers/transform.helper');

const template = {
  'task_name': '{{#? TASKNAME}}',
  'task_id': '{{#? TASKID}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'full_name_customer': '{{#? FULLNAMECUS}}',
  'gender': '{{#? GENDER}}',
  'birth_day': '{{#? BIRTHDAY}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'email': '{{#? EMAIL}}',
  'address_full': '{{#? ADDRESSFULL}}',
  'status': '{{#? STATUS}}',
  'status_name': '{{#? STATUSNAME}}',
};

let transform = new Transform(template);

const detail = (customerDataLead) => {
  return transform.transform(customerDataLead, [
    'task_id', 'task_name',
  ]);
};

const list = (customerDataLeads = []) => {
  return transform.transform(customerDataLeads, [
    'task_id', 'task_name',
  ]);
};
const listDataleads = (list = []) => {
  return transform.transform(list, [
    'data_leads_id','full_name_customer','gender','birth_day','phone_number','email','address_full','status','status_name', 'task_id', 'task_name',
  ]);
};

const templateTaskDataleads = {
  'task_data_leads_id': '{{#? TASKDATALEADSID}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'task_workflow_id': '{{#? TASKWORKFLOWID}}',
  'task_id': '{{#? TASKID}}',
  'user_name': '{{#? USERNAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'supervisor_name': '{{#? SUPERVISORNAME}}',
};
const detailTaskDataleads = (taskdataleads) => {
  let transform = new Transform(templateTaskDataleads);

  return transform.transform(taskdataleads, [
    'task_data_leads_id','data_leads_id', 'task_workflow_id','task_id'
    ,'user_name','is_active','created_user', 'supervisor_name',
  ]);
};
module.exports = {
  detail,
  list,
  listDataleads,
  detailTaskDataleads,
};
