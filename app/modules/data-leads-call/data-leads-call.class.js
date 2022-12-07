const Transform = require('../../common/helpers/transform.helper');

const template = {
  'data_leads_call_id': '{{#? DATALEADSCALLID}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'task_id': '{{#? TASKID}}',
  'responsible_user_name': '{{#? RESPONSIBLEUSERNAME}}',
  'call_type_id': '{{#? CALLTYPEID}}',
  'event_start_date_time': '{{#? EVENTSTARTDATETIME}}',
  'event_end_date_time': '{{#? EVENTENDDATETIME}}',
  'duration': '{{#? DURATION}}',
  'subject': '{{#? SUBJECT}}',
  'description': '{{#? DESCRIPTION}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);


const listDataLeadsCall = (calls = []) => {
  return transform.transform(calls, [
    'data_leads_call_id','data_leads_id','task_id','responsible_user_name','call_type_id','event_start_date_time',
    'event_end_date_time','duration','subject','description','created_user', 'created_date',
  ]);
};

module.exports = {
  listDataLeadsCall,
};
