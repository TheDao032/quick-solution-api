const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'setup_service_id': '{{#? SETUPSERVICEID}}',
  'webcategory_id': '{{#? WEBCATEGORYID}}',
  'category_name': '{{#? CATEGORYNAME}}',
  'setup_service_title': '{{#? SETUPSERVICETITLE}}',
  'content': '{{#? CONTENT}}',
  'meta_key_words': '{{#? METAKEYWORDS}}',
  'meta_descriptions': '{{#? METADESCRIPTIONS}}',
  'meta_title': '{{#? METATITLE}}',
  'seo_name': '{{#? SEONAME}}',
  'system_name_setup': '{{#? SYSTEMNAME}}',
  'description': '{{#? DESCRIPTION}}',
  'short_description': '{{#? SHORTDESCRIPTION}}',
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
  'user': '{{#? USER}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'is_show_home':'{{ISSHOWHOME ? 1 : 0}}',
  'is_service_package': '{{ISSERVICEPACKAGE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'setup_service_id','setup_service_title','webcategory_id','category_name','description','short_description','content', 'system_name_setup'
    ,'meta_key_words','meta_descriptions','meta_title','seo_name','image_file_id','image_url','small_thumbnail_image_url'
    ,'medium_thumbnail_image_url','large_thumbnail_image_url','xlarge_thumbnail_image_url','small_thumbnail_image_file_id'
    ,'medium_thumbnail_image_file_id','large_thumbnail_image_file_id','xlarge_thumbnail_image_file_id'
    ,'is_active','is_system','is_show_home','is_service_package','user','create_date',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'setup_service_id','setup_service_title','category_name','system_name_setup','is_active','create_date','user',
  ]);
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
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
