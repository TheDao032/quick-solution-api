const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'news_category_id': '{{#? NEWSCATEGORYID}}',
  'parent_id': '{{#? PARENTID}}',
  'parent_name': '{{#? PARENTNAME}}',
  'news_category_name': '{{#? NEWSCATEGORYNAME}}',
  'pictures': `${config.domain_cdn}{{IMAGEURL}}`,
  'image_file_id': '{{#? IMAGEFILEID}}',
  'description': '{{#? DESCRIPTION}}',
  'meta_key_words': '{{#? METAKEYWORDS}}',
  'meta_descriptions': '{{#? METADESCRIPTIONS}}',
  'meta_title': '{{#? METATITLE}}',
  'seo_name': '{{#? SEONAME}}',
  'category_level': '{{#? CATEGORYLEVEL}}',
  'order_index': '{{#? ORDERINDEX}}',
  'user': '{{#? USER}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_cate_video': '{{ISCATEVIDEO ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'parent_id': '{{#? PARENTID}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'news_category_id','parent_id','news_category_name','category_level','pictures','image_file_id','description','meta_key_words',
    'meta_descriptions','meta_title', 'seo_name', 'order_index','create_date','is_active','is_cate_video','is_system',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'news_category_id','parent_id','parent_name','news_category_name','is_cate_video','user','create_date',
    'is_active',
  ]);
};

const listAll = (area = []) => {
  let transform = new Transform(templateOption);

  return transform.transform(area, [
    'id','name','parent_id',
  ]);
};

module.exports = {
  list,
  detail,
  listAll,
};
