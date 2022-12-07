const Transform = require('../../common/helpers/transform.helper');

const template = {
  'campaign_status_id': '{{#? CAMPAIGNSTATUSID}}',
  'campaign_status_name': '{{#? CAMPAIGNSTATUSNAME}}',
  'create_date': '{{#? CREATEDDATE}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (company) => {
  return transform.transform(company, [
    'campaign_status_id','campaign_status_name', 'description', 'is_active',
  ]);
};

const list = (campaignStatuss = []) => {
  return transform.transform(campaignStatuss, [
    'campaign_status_id','campaign_status_name', 'create_date', 'description', 'is_active',
  ]);
};

const detailUsed = (used = []) => {
  return transform.transform(used, [
    'result','table_used',
  ]);
};

module.exports = {
  list,
  detail,
  detailUsed,
};
