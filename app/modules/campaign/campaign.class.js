const Transform = require('../../common/helpers/transform.helper');

const template = {
  'campaign_id': '{{#? CAMPAIGNID}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'campaign_type_id': '{{#? CAMPAIGNTYPEID}}',
  'campaign_type_name': '{{#? CAMPAIGNTYPENAME}}',
  'campaign_status_id': '{{#? CAMPAIGNSTATUSID}}',
  'campaign_status_name': '{{#? CAMPAIGNSTATUSNAME}}',
  'parent_id': '{{#? PARENTID}}',
  'start_date': '{{#? STARTDATE}}',
  'end_date': '{{#? ENDDATE}}',
  'campaign_name': '{{#? CAMPAIGNNAME}}',
  'total_values': '{{#? TOTALVALUES}}',
  'reason': '{{#? REASON}}',
  'short_description': '{{#? SHORTDESCRIPTION}}',
  'description': '{{#? DESCRIPTION}}',
  'order_index': '{{#? ORDERINDEX}}',
  'reviewed_date': '{{#? REVIEWEDDATE}}',
  'is_reviewed': '{{ISREVIEWED}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_campaign': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_campaign': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_campaign': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const detail = (campaign) => {
  return transform.transform(campaign, [
    'campaign_id', 'campaign_name', 'campaign_type_id', 'campaign_type_name', 'company_id',
    'company_name', 'business_id', 'business_name', 'campaign_status_id', 'campaign_status_name',
    'start_date', 'end_date', 'total_values', 'parent_id', 'reason', 'short_description',
    'description', 'order_index', 'reviewed_date', 'is_reviewed', 'is_active',
  ]);
};

const list = (campaigns = []) => {
  return transform.transform(campaigns, [
    'campaign_id', 'campaign_name', 'campaign_type_id', 'campaign_type_name', 'company_id',
    'company_name', 'business_id', 'business_name', 'campaign_status_id', 'campaign_status_name',
    'is_reviewed', 'is_active', 'start_date', 'end_date', 'total_values', 'created_date',
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
  detail,
  list,
  options,
};
