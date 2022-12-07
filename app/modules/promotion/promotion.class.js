const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'promotion_id': '{{#? PROMOTIONID}}',
  'promotion_name': '{{#? PROMOTIONNAME}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'url_banner': '{{URLBANNER}}',
  'url_image_promotion':'{{URLIMAGEPROMOTION}}',
  'begin_date': '{{#? BEGINDATE}}',
  'end_date': '{{#? ENDDATE}}',
  'is_promotion_customer_type':'{{ISPROMOTIONCUSTOMERTYPE ? 1 : 0}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_review': '{{ISREVIEW}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'short_description': '{{#? SHORTDESCRIPTION}}',
  'description': '{{#? DESCRIPTION}}',
  'is_apply_hours': '{{#? ISAPPLYHOURS}}',
  'start_hours': '{{#? STARTHOURS}}',
  'end_hours': '{{#? ENDHOURS}}',
  'is_apply_mon': '{{ISAPPLYMON ? 1 : 0}}',
  'is_apply_tu': '{{ISAPPLYTU ? 1 : 0}}',
  'is_apply_we': '{{ISAPPLYWE ? 1 : 0}}',
  'is_apply_th': '{{ISAPPLYTH ? 1 : 0}}',
  'is_apply_fr': '{{ISAPPLYFR ? 1 : 0}}',
  'is_apply_sa': '{{ISAPPLYSA ? 1 : 0}}',
  'is_apply_sun': '{{ISAPPLYSUN ? 1 : 0}}',
  'is_promotion_by_price': '{{ISPROMOTIONBYPRICE ? 1 : 0}}',
  'from_price': '{{#? FROMPRICE}}',
  'to_price': '{{#? TOPRICE}}',
  'is_promotion_by_total_money': '{{ISPROMOTIONBYTOTALMONEY ? 1 : 0}}',
  'min_promotion_total_money': '{{#? MINPROMOTIONTOTALMONEY}}',
  'max_promotion_total_money': '{{#? MAXPROMOTIONTOTALMONEY}}',
  'is_promorion_by_total_quantity': '{{ISPROMOTIONBYTOTALQUANTITY ? 1 : 0}}',
  'min_promotion_total_quantity': '{{#? MINPROMOTIONTOTALQUANTITY}}',
  'max_promotion_total_quantity': '{{#? MAXPROMOTIONTOTALQUANTITY}}',
  'is_apply_with_order_promotion': '{{ISAPPLYWITHORDERPROMOTION ? 1 : 0}}',
  'is_combo_promotion': '{{ISCOMBOPROMOTION ? 1 : 0}}',
  'is_limit_promotion_times': '{{ISLIMITPROMOTIONTIMES ? 1 : 0}}',
  'max_promotion_times': '{{#? MAXPROMOTIONTIMES}}',
  'is_reward_point': '{{ISREWARDPOINT ? 1 : 0}}',
  'user_review': '{{#? USERREVIEW}}',
  'review_date': '{{#? REVIEWDATE}}',
  'note_review': '{{#? NOTEREVIEW}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',
};

let transform = new Transform(template);

const detail = (area) => {
  const data = transform.transform(area, [
    'promotion_id','promotion_name','company_id','company_name','url_banner','url_image_promotion','description','short_description','begin_date','end_date','is_promotion_customer_type','is_apply_hours',
    'start_hours','end_hours', 'is_apply_mon','is_apply_tu','is_apply_we','is_apply_th', 'is_apply_fr','is_apply_sa','is_apply_sun',
    'is_promotion_by_price','from_price','to_price','is_promotion_by_total_money','max_promotion_total_money','min_promotion_total_money',
    'is_promorion_by_total_quantity','min_promotion_total_quantity','max_promotion_total_quantity','is_apply_with_order_promotion','is_combo_promotion','is_limit_promotion_times',
    'max_promotion_times','is_reward_point','user_review','review_date','note_review','create_date', 'is_active','is_review','is_system',
  ]);
  data.url_banner = data.url_banner ? `${config.domain_cdn}${data.url_banner}` : '';
  data.url_image_promotion = data.url_image_promotion ? `${config.domain_cdn}${data.url_image_promotion}` : '';
  return data;
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'promotion_id','promotion_name','company_name',
    'business_name','begin_date','end_date','create_date', 'is_active','is_review','user_review','is_apply_with_order_promotion',
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
