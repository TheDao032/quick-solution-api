const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'comment_id': '{{#? COMMENTID}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'task_id': '{{#? TASKID}}',
  'user_name_comment': '{{#? USERNAMECOMMENT}}',
  'user_full_name_comment': '{{#? USERFULLNAMECOMMENT}}',
  'default_picture_url_commment': `${config.domain_cdn}{{DEFAULTPICTUREURLCOMMENT}}`,
  'content_comment': '{{#? CONTENTCOMMENT}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

const templateFileAttactment = {
  'attachment_id': '{{#? FILEATTACHMENTID}}',
  'active_id': '{{#? ACTTIVEID}}',
  'attachment_name': '{{#? ATTACHMENTNAME}}',
  'attachment_path': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
  'is_comment': '{{ISCOMMENT ? 1 : 0}}',
  'is_call': '{{ISCALL ? 1 : 0}}',
  'is_meeting': '{{ISMEETING ? 1 : 0}}',
  'is_sms': '{{ISSMS ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
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
const detail = (dataleadscomment) => {
  let transform = new Transform(template);
  return transform.transform(dataleadscomment, [
    'comment_id','data_leads_id', 'task_id','user_name_comment'
    ,'user_full_name_comment','default_picture_url_commment','content_comment','created_date',
  ]);
};

const list = (dataleadscomments = []) => {
  let transform = new Transform(template);

  return transform.transform(dataleadscomments, [
    'comment_id','data_leads_id', 'task_id','user_name_comment'
    ,'user_full_name_comment','default_picture_url_commment','content_comment','created_date',
  ]);
};

const detailFileAttactment = (fileattachment) => {
  let transform = new Transform(templateFileAttactment);

  return transform.transform(fileattachment, [
    'attachment_id','active_id', 'attachment_name','attachment_path'
    ,'is_comment','is_call','is_meeting', 'is_sms',
  ]);
};

const listFileAttactment = (fileattachments = []) => {
  let transform = new Transform(templateFileAttactment);

  return transform.transform(fileattachments, [
    'attachment_id','active_id', 'attachment_name','attachment_path'
    ,'is_comment','is_call','is_meeting', 'is_sms',
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
  detailFileAttactment,
  listFileAttactment,
  detailTaskDataleads,
};
