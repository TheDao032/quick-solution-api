const Transform = require('../../common/helpers/transform.helper');

const template = {
  'status_data_leads_id': '{{#? STATUSDATALEADSID}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'status_name': '{{#? STATUSNAME}}',
  'created_date': '{{#? CREATEDDATE}}',
  'is_won': '{{ISWON? 1 : 0}}',
  'is_lost': '{{ISLOST? 1 : 0}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (company) => {
  return transform.transform(company, [
    'status_data_leads_id','business_id', 'business_name','company_id','company_name', 'status_name', 'is_won', 'is_lost', 'is_active','created_date',
  ]);
};

const list = (campaignStatuss = []) => {
  return transform.transform(campaignStatuss, [
    'status_data_leads_id','business_id', 'business_name','company_id','company_name', 'status_name', 'is_deleted', 'is_active','created_date',
  ]);
};

// options
const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name']);
};
module.exports = {
  list,
  detail,
  options,
};
