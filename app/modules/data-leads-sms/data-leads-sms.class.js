const Transform = require('../../common/helpers/transform.helper');

const template = {
  'data_leads_sms_id': '{{#? DATALEADSSMSID}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'task_id': '{{#? TASKID}}',
  'content_sms': '{{#? CONTENTSMS}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);


const listDataLeadsSms = (smss = []) => {
  return transform.transform(smss, [
    'data_leads_sms_id','data_leads_id','task_id','content_sms',
    'created_user', 'created_date',
  ]);
};

module.exports = {
  listDataLeadsSms,
};
