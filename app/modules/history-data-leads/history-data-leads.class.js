const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'history_data_leads_id': '{{#? HISTORYDATALEADSID}}',
  'task_data_leads_id': '{{#? TASKDATALEADSID}}',
  'task_workflow_id': '{{#? TASKWORKFLOWID}}',
  'task_workflow_name': '{{#? TASKWORKFLOWNAME}}',
  'task_workflow_old_id': '{{#? TASKWORKFLOWOLDID}}',
  'task_workflow_old_name': '{{#? TASKWORKFLOWOLDNAME}}',
  'comment': '{{#? COMMENT}}',
  'data_leads_sms_id': '{{#? DATALEADSSMSID}}',
  'comment_id': '{{#? COMMENTID}}',
  'data_leads_meeting_id': '{{#? DATALEADSMEETINGID}}',
  'data_leads_mail_id': '{{#? DATALEADEMAILID}}',
  'data_leads_call_id': '{{#? DATALEADSCALLID}}',
  'user_name': '{{#? USERNAME}}',
  'supervisor_name': '{{#? SUPERVISORNAME}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_user_full_name': '{{#? CREATEDUSERFULLNAME}}',
  'created_user_default_picture_url': `${config.domain_cdn}{{CREATEDUSERDEFAULTPICTUREURL}}`,
  'created_date': '{{#? CREATEDDATE}}',
};

const detail = (history) => {
  let transform = new Transform(template);

  return transform.transform(history, [
    'history_data_leads_id','task_data_leads_id', 'task_workflow_id', 'task_workflow_name',
    'task_workflow_old_id', 'task_workflow_old_name','comment','data_leads_sms_id',
    'comment_id','data_leads_meeting_id', 'data_leads_mail_id',
    'data_leads_call_id', 'user_name', 'supervisor_name', 'created_user',
    'created_user_full_name', 'created_user_default_picture_url','created_date',
  ]);
};

const list = (histories = []) => {
  let transform = new Transform(template);
  return transform.transform(histories, [
    'history_data_leads_id','task_data_leads_id', 'task_workflow_id', 'task_workflow_name',
    'task_workflow_old_id', 'task_workflow_old_name','comment','data_leads_sms_id',
    'comment_id','data_leads_meeting_id', 'data_leads_mail_id',
    'data_leads_call_id', 'user_name', 'supervisor_name', 'created_user',
    'created_user_full_name', 'created_user_default_picture_url','created_date',
  ]);
};

const templateMeeting = {
  'data_leads_meeting_id': '{{#? DATALEADSMEETINGID}}',
  'responsible_user_name': '{{#? RESPONSIBLEUSERNAME}}',
  'responsible_user_full_name': '{{#? RESPONSIBLEUSERFULLNAME}}',
  'responsible_user_default_picture_url': `${config.domain_cdn}{{RESPONSIBLEUSERDEFAULTPICTUREURL}}`,
  'meeting_subject': '{{#? MEETINGSUBJECT}}',
  'content_meeting': '{{#? CONTENTMEETING}}',
  'location': '{{#? LOCATION}}',
  'event_start_date_time': '{{#? EVENTSTARTDATETIME}}',
  'event_end_date_time': '{{#? EVENTENDDATETIME}}',
};
const detailMeeting = (dataleadsmeetting) => {
  let transform = new Transform(templateMeeting);
  return transform.transform(dataleadsmeetting, [
    'data_leads_meeting_id','responsible_user_name', 'responsible_user_full_name',
    'responsible_user_default_picture_url', 'meeting_subject','content_meeting','event_start_date_time',
    'event_end_date_time','location',
  ]);
};


const templateSMS = {
  'data_leads_sms_id': '{{#? DATALEADSSMSID}}',
  'content_sms': '{{#? CONTENTSMS}}',
};

const detailSMS = (dataleadssms) => {
  let transform = new Transform(templateSMS);
  return transform.transform(dataleadssms, [
    'data_leads_sms_id','content_sms',
  ]);
};

const templateComment = {
  'comment_id': '{{#? COMMENTID}}',
  'user_name_comment': '{{#? USERNAMECOMMENT}}',
  'content_comment': '{{#? CONTENTCOMMENT}}',
};
const detailComment = (dataleadscomment) => {
  let transform = new Transform(templateComment);
  return transform.transform(dataleadscomment, [
    'comment_id','user_name_comment','content_comment',
  ]);
};

const templateMail = {
  'data_leads_mail_id': '{{#? DATALEADSMAILID}}',
  'campaign_id': '{{#? CAMPAIGNID}}',
  'campaign_name': '{{#? CAMPAIGNNAME}}',
  'sender_id': '{{#? SENDERID}}',
  'sender_name': '{{#? SENDERNAME}}',
  'sender_email': '{{#? SENDEREMAIL}}',
  'list_id': '{{#? LISTID}}',
  'list_name': '{{#? LISTNAME}}',
  'status': '{{#? STATUS}}',
};


const detailMail = (call) => {
  let transform = new Transform(templateMail);
  return transform.transform(call, [
    'data_leads_mail_id','campaign_id','campaign_name','sender_id',
    'sender_name','sender_email','list_id','list_name','status',
  ]);
};
const templateCall = {
  'data_leads_call_id': '{{#? DATALEADSCALLID}}',
  'responsible_user_name': '{{#? RESPONSIBLEUSERNAME}}',
  'call_type_id': '{{#? CALLTYPEID}}',
  'event_start_date_time': '{{#? EVENTSTARTDATETIME}}',
  'event_end_date_time': '{{#? EVENTENDDATETIME}}',
  'duration': '{{#? DURATION}}',
  'subject': '{{#? SUBJECT}}',
  'description': '{{#? DESCRIPTION}}',
};


const detailCall = (call) => {
  let transform = new Transform(templateCall);
  return transform.transform(call, [
    'data_leads_call_id','responsible_user_name','call_type_id','event_start_date_time',
    'event_end_date_time','duration','subject','description',
  ]);
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
};
const listFileAttactment = (fileattachments = []) => {
  let transform = new Transform(templateFileAttactment);

  return transform.transform(fileattachments, [
    'attachment_id','active_id', 'attachment_name','attachment_path'
    ,'is_comment','is_call','is_meeting', 'is_sms',
  ]);
};
module.exports = {
  detail,
  list,
  detailMeeting,
  detailSMS,
  detailComment,
  detailCall,
  detailMail,
  listFileAttactment,
};
