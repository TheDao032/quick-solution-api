const Transform = require('../../common/helpers/transform.helper');

const template = {
  'segment_id': '{{#? SEGMENTID}}',
  'segment_name': '{{#? SEGMENTNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'created_date': '{{#? CREATEDDATE}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_delete': '{{ISDELETED ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',
};

let transform = new Transform(template);

const detail = (company) => {
  return transform.transform(company, [
    'segment_id','segment_name','company_id', 'company_name','business_id', 'business_name', 'created_date',
    'description', 'is_active', 'is_system',
  ]);
};

const list = (segments = []) => {
  return transform.transform(segments, [
    'segment_id','segment_name', 'company_name', 'business_name', 'created_date',
    'description', 'is_active', 'is_delete','is_system',
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
