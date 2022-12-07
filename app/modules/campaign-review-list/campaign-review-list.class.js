const Transform = require('../../common/helpers/transform.helper');
const _ = require('lodash');
const config = require('../../../config/config');

const template = {
  'review_list_id': '{{#? REVIEWLISTID}}',
  'campaign_id': '{{#? CAMPAIGNID}}',
  'campaign_review_level_id': '{{#? CAMPAIGNREVIEWLEVELID}}',
  'review_user': '{{#? REVIEWUSER}}',
  'review_date': '{{#? REVIEWEDDATE}}',
  'is_review': '{{#? ISREVIEW}}',
  'note': '{{#? NOTE}}',
  'campaign_review_level_name': '{{#? CAMPAIGNREVIEWLEVELNAME}}',
  'default_picture_url': '{{#? REVIEWUSERAVATAR}}',
  'review_user_full_name': '{{#? REVIEWUSERFULLNAME}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const detail = (campaign) => {
  return transform.transform(campaign, [
  ]);
};

const list = (campaigns = []) => {
  const data = transform.transform(campaigns, [
    'review_list_id', 'campaign_review_level_id', 'campaign_review_level_name', 'review_user',
    'review_date', 'is_review', 'note', 'default_picture_url', 'review_user_full_name',
  ]);

  _.each(data, (item) => {
    item.default_picture_url = item.default_picture_url ? `${config.domain_cdn}${item.default_picture_url}` : '';
  });

  return data;
};

module.exports = {
  detail,
  list,
};
