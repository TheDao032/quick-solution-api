const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'news_id': '{{#? NEWSID}}',
  'news_title': '{{#? NEWSTITLE}}',
  'news_date': '{{#? NEWSDATE}}',
  'short_description': '{{#? SHORTDESCRIPTION}}',
  'description': '{{#? DESCRIPTION}}',
  'content': '{{#? CONTENT}}',
  'author_full_name': '{{#? AUTHORFULLNAME}}',
  'news_source': '{{#? NEWSSOURCE}}',
  'is_video': '{{#? ISVIDEO}}',
  'video_link': '{{#? VIDEOLINK}}',
  'news_status_id': '{{#? NEWSSTATUSID}}',
  'news_status_name': '{{#? NEWSSTATUSNAME}}',
  'news_category_id': '{{#? NEWSCATEGORYID}}',
  'news_category_name': '{{#? NEWSCATEGORYNAME}}',
  'news_tag': '{{#? NEWSTAG}}',
  'meta_key_words': '{{#? METAKEYWORDS}}',
  'meta_description': '{{#? METADESCRIPTIONS}}',
  'meta_title': '{{#? METATITLE}}',
  'seo_name': '{{#? SEONAME}}',
  'image_file_id': '{{#? IMAGEFILEID}}',
  'image_url': `${config.domain_cdn}{{IMAGEURL}}`,
  'small_thumbnail_image_file_id': '{{#? SMALLTHUMBNAILIMAGEFILEID}}',
  'small_thumbnail_image_url': `${config.domain_cdn}{{SMALLTHUMBNAILIMAGEURL}}`,
  'medium_thumbnail_image_file_id': '{{#? MEDIUMTHUMBNAILIMAGEFILEID}}',
  'medium_thumbnail_image_url': `${config.domain_cdn}{{MEDIUMTHUMBNAILIMAGEURL}}`,
  'large_thumbnail_image_file_id': '{{#? LARGETHUMBNAILIMAGEFILEID}}',
  'large_thumbnail_image_url': `${config.domain_cdn}{{LARGETHUMBNAILIMAGEURL}}`,
  'xlarge_thumbnail_image_file_id': '{{#? XLARGETHUMBNAILIMAGEFILEID}}',
  'xlarge_thumbnail_image_url': `${config.domain_cdn}{{XLARGETHUMBNAILIMAGEURL}}`,
  'view_count': '{{#? VIEWCOUNT}}',
  'comment_count': '{{#? COMMENTCOUNT}}',
  'like_count': '{{#? LIKECOUNT}}',
  'order_index': '{{#? ORDERINDEX}}',
  'is_show_home': '{{ISSHOWHOME ? 1 : 0}}',
  'is_high_light': '{{ISHIGHLIGHT ? 1 : 0}}',
  'is_show_notify': '{{ISSHOWNOTIFY ? 1 : 0}}',
  'is_hot_news': '{{ISHOTNEWS ? 1 : 0}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'user': '{{#? USER}}',
  'create_date': '{{#? CREATEDDATE}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'news_id','news_status_id','news_title','news_date','short_description','description','content','author_full_name','news_source',
    'is_video','video_link', 'news_status_name','news_category_id', 'news_category_name','news_tag','meta_key_words','meta_description','meta_title',
    'seo_name','image_url', 'image_file_id', 'small_thumbnail_image_file_id','small_thumbnail_image_url','medium_thumbnail_image_file_id',
    'medium_thumbnail_image_url','large_thumbnail_image_file_id','large_thumbnail_image_url','xlarge_thumbnail_image_file_id',
    'xlarge_thumbnail_image_url','view_count','comment_count','like_count','order_index','is_show_home','is_high_light',
    'is_show_notify','is_hot_news','is_active','is_system','create_date',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'news_id','news_title','news_category_name','news_status_name','view_count','comment_count','like_count','is_video','user','news_date','create_date','is_active',
  ]);
};

const listAll = (area = []) => {
  let transform = new Transform(templateOption);

  return transform.transform(area, [
    'id','name',
  ]);
};

module.exports = {
  list,
  detail,
  listAll,
};
