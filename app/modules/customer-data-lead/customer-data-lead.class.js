const Transform = require('../../common/helpers/transform.helper');

const template = {
  'data_leads_id': '{{#? DATALEADSID}}',
  'full_name': '{{#? FULLNAME}}',
  'birthday': '{{#? BIRTHDAY}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'gender': '{{GENDER}}',
  'email': '{{#? EMAIL}}',
  'marital_status': '{{MARITALSTATUS ? 1 : 0}}',
  'id_card': '{{#? IDCARD}}',
  'id_card_date': '{{#? IDCARDDATE}}',
  'id_card_place': '{{#? IDCARDPLACE}}',
  'address_full': '{{#? ADDRESSFULL}}',
  'address': '{{#? ADDRESS}}',
  'province_id': '{{#? PROVINCEID}}',
  'province_name': '{{#? PROVINCENAME}}',
  'district_id': '{{#? DISTRICTID}}',
  'district_name': '{{#? DISTRICTNAME}}',
  'country_id': '{{#? COUNTRYID}}',
  'country_name': '{{#? COUNTRYNAME}}',
  'ward_id': '{{#? WARDID}}',
  'ward_name': '{{#? WARDNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'segment_id': '{{#? SEGMENTID.split("|")}}',
  'segment_name': '{{#? SEGMENTNAME.split("|")}}',
  'campaign_id': '{{#? CAMPAIGNID}}',
  'campaign_name': '{{#? CAMPAIGNNAME.split("|")}}',
  'status_data_leads_id': '{{#? STATUSDATALEADSID}}',
  'status_data_leads_name': '{{#? STATUSDATALEADSNAME}}',
  'task_status_id': '{{#? TASKSTATUSID}}',
  'task_status_name': '{{#? TASKSTATUSNAME}}',
  'is_completed_task': '{{#? ISCOMPLETEDTASK}}',
  'status_data_leads_key': '{{#? STATUSDATALEADSKEY}}',
  'task_id': '{{#? TASKID}}',
  'created_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (customerDataLead) => {
  return transform.transform(customerDataLead, [
    'data_leads_id', 'full_name', 'birthday', 'gender', 'phone_number', 'email', 'marital_status', 'id_card', 'id_card_date', 'id_card_place',
    'address', 'address_full', 'province_id', 'province_name', 'district_id', 'district_name', 'country_id', 'country_name',
    'ward_id', 'ward_name', 'is_active', 'segment_id', 'segment_name', 'campaign_id', 'campaign_name', 'company_id', 'company_name',
    'business_id', 'business_name', 'status_data_leads_id', 'task_id',
  ]);
};

const list = (customerDataLeads = []) => {
  return transform.transform(customerDataLeads, [
    'data_leads_id', 'full_name', 'birthday', 'gender', 'phone_number', 'email', 'address_full', 'company_name', 'segment_name',
    'campaign_name', 'status_data_leads_id', 'status_data_leads_name','status_data_leads_key',
    'task_status_id','task_status_name', 'created_date', 'is_active', 'task_id', 'id_card', 'marital_status',
  ]);
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name']);
};

module.exports = {
  detail,
  list,
  options,
};
