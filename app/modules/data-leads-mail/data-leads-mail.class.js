const Transform = require('../../common/helpers/transform.helper');

const template = {
  'data_leads_mail_id': '{{#? DATALEADSEMAILID}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'task_id': '{{#? TASKID}}',
  'campaign_id': '{{#? CAMPAIGNID}}',
  'campaign_name': '{{#? CAMPAIGNNAME}}',
  'sender_name': '{{#? SENDERNAME}}',
  'sender_email': '{{#? SENDEREMAIL}}',
  'sender_id': '{{#? SENDERID}}',
  'list_id': '{{#? LISTID}}',
  'list_name': '{{#? LISTNAME}}',
  'status': '{{#? STATUS}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
};

const listDataLeadsMail = (Mail = []) => {
  let transform = new Transform(template);
  return transform.transform(Mail, [
    'data_leads_mail_id','data_leads_id','task_id','campaign_id','campaign_name','sender_name',
    'sender_email','sender_id','list_id','list_name',
    'status','created_user', 'created_date',
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
  listDataLeadsMail,
  detailTaskDataleads,
};
