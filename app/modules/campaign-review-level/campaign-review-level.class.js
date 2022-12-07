const Transform = require('../../common/helpers/transform.helper');

const template = {
  'campaign_review_level_id': '{{#? CAMPAIGNREVIEWLEVELID}}',
  'campaign_review_level_name': '{{#? CAMPAIGNREVIEWLEVELNAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'description': '{{#? DESCRIPTION}}',
  'is_complete_review': '{{ISCOMPELEREVIEW ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (company) => {
  return transform.transform(company, [
    'campaign_review_level_id', 'campaign_review_level_name', 'is_active', 'description', 'is_complete_review',
  ]);
};

const list = (companys = []) => {
  return transform.transform(companys, [
    'campaign_review_level_id', 'campaign_review_level_name', 'is_active', 'description', 'is_complete_review',
  ]);
};

module.exports = {
  list,
  detail,
};
