const Transform = require('../../common/helpers/transform.helper');

const template = {
  'campaign_review_level_user_id': '{{#? CAMPAIGNREVIEWLEVELUSERID}}',
  'campaign_type_name': '{{#? CAMPAIGNTYPENAME}}',
  'campaign_type_id': '{{#? CAMPAIGNTYPEID}}',
  'campaign_review_level_name': '{{#? CAMPAIGNREVIEWLEVELNAME}}',
  'campaign_review_level_id': '{{#? CAMPAIGNREVIEWLEVELID}}',
  'department_id': '{{#? DEPARTMENTID}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'user_name': '{{#? USERNAME}}',
  'is_default': '{{ISDEFAULT ? 1 : 0}}',
};

let transform = new Transform(template);


const list = (campaignType = []) => {
  return transform.transform(campaignType, [
    'campaign_review_level_user_id','campaign_type_id','campaign_type_name','campaign_review_level_id'
    ,'campaign_review_level_name','department_id','department_name', 'is_default',
  ]);
};

module.exports = {
  list,
};
