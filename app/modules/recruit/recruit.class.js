const Transform = require('../../common/helpers/transform.helper');

const template = {
  'recruit_id': '{{#? RECRUITID}}',
  'recruit_title': '{{#? RECRUITTITLE}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'position_id': '{{#? POSITIONID}}',
  'position_name': '{{#? POSITIONNAME}}',
  'quantity': '{{#? QUANTITY}}',
  'salary_from': '{{#? SALARYFROM}}',
  'salary_to': '{{#? SALARYTO}}',
  'recruit_content': '{{#? RECRUITCONTENT}}',
  'start_date': '{{#? STARTDATE}}',
  'end_date': '{{#? ENDDATE}}',
  'date': '{{#? DATE}}',
  'apply_count': '{{#? APPLYCOUNT}}',
  'meta_keywords': '{{#? METAKEYWORDS}}',
  'meta_descriptions': '{{#? METADESCRIPTIONS}}',
  'meta_title': '{{#? METATITLE}}',
  'seo_name': '{{#? SEONAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_delete': '{{ISDELETED ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (company) => {
  return transform.transform(company, [
    'recruit_id','recruit_title','position_id', 'position_name','business_id', 'business_name','company_id','company_name', 'quantity',
    'salary_from','salary_to','recruit_content','start_date','end_date','apply_count',
    'meta_keywords','meta_descriptions','meta_title','seo_name', 'is_active',
  ]);
};

const list = (segments = []) => {
  return transform.transform(segments, [
    'recruit_id','recruit_title','position_id', 'position_name','business_id', 'business_name',
    'start_date', 'end_date','date', 'apply_count', 'is_active',
  ]);
};


module.exports = {
  list,
  detail,
};
