const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'data_leads_meeting_id': '{{#? DATALEADSMEETINGID}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'task_id': '{{#? TASKID}}',
  'responsible_user_name': '{{#? RESPONSIBLEUSERNAME}}',
  'responsible_user_full_name': '{{#? RESPONSIBLEUSERFULLNAME}}',
  'responsible_user_default_picture_url': `${config.domain_cdn}{{RESPONSIBLEUSERDEFAULTPICTUREURL}}`,
  'meeting_subject': '{{#? MEETINGSUBJECT}}',
  'content_meeting': '{{#? CONTENTMEETING}}',
  'location': '{{#? LOCATION}}',
  'event_start_date_time': '{{#? EVENTSTARTDATETIME}}',
  'event_end_date_time': '{{#? EVENTENDDATETIME}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_user_full_name': '{{#? CREATEDUSERFULLNAME}}',
  'created_user_default_picture_url': `${config.domain_cdn}{{CREATEDUSERDEFAULTPICTUREURL}}`,
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
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
const detail = (dataleadsmeetting) => {
  let transform = new Transform(template);
  return transform.transform(dataleadsmeetting, [
    'data_leads_meeting_id', 'data_leads_id','task_id','responsible_user_name', 'responsible_user_full_name',
    'responsible_user_default_picture_url', 'meeting_subject','content_meeting','event_start_date_time',
    'event_end_date_time','created_user','created_user_full_name','created_user_default_picture_url','created_date',
  ]);
};

const list = (dataleadsmeettings = []) => {
  let transform = new Transform(template);

  return transform.transform(dataleadsmeettings, [
    'data_leads_meeting_id', 'data_leads_id','task_id','responsible_user_name', 'responsible_user_full_name',
    'responsible_user_default_picture_url', 'meeting_subject','content_meeting','event_start_date_time',
    'event_end_date_time','created_user','created_user_full_name','created_user_default_picture_url','created_date',
  ]);
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
  detailTaskDataleads,
};
