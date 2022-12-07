const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'price_id': '{{#? PRICEID}}',
  'output_type_id': '{{#? OUTPUTTYPEID}}',
  'output_type_name': '{{#? OUTPUTTYPENAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'area_id': '{{#? AREAID}}',
  'area_name': '{{#? AREANAME}}',
  'product_id': '{{#? PRODUCTID}}',
  'product_code': '{{#? PRODUCTCODE}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'picture_url': `${config.domain_cdn}{{PICTUREURL}}`,
  'price': '{{#? PRICE}}',
  'price_vat': '{{#? PRICEVAT}}',
  'start_date': '{{#? STARTDATE}}',
  'end_date': '{{#? ENDDATE}}',
  'review_date': '{{#? REVIEWDATE}}',
  'apply_time': '{{#? APPLYTIME}}',
  'notes': '{{#? NOTES}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_review': '{{ISREVIEW}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'is_output_for_web': '{{ISOUTPUTFORWEB ? 1 : 0}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'price_review_level_id': '{{#? PRICEREVIEWLEVELID}}',
  'review_level_name': '{{#? REVIEWLEVELNAME}}',
  'user_name': '{{#? USERNAME}}',
  'review_user': '{{#? REVIEWUSER}}',
  'auto_review': '{{#? AUTOREVIEW}}',
  'price_apply_review_level_id': '{{#? PRICEAPPLYREVIEWLEVELID}}',

};

let transform = new Transform(template);

const detailPrices = (slPrice) => {
  return transform.transform(slPrice, [
    'price_id','output_type_id','output_type_name',
    'price', 'price_vat', 'review_date', 'notes', 'is_review',
    'is_active','is_output_for_web',
  ]);
};
const detailProduct = (slPrice) => {
  return transform.transform(slPrice, [
    'product_id','product_code','picture_url',
    'product_name', 'start_date', 'end_date','notes', 'is_review',
    'is_active','auto_review','is_output_for_web',
  ]);
};

const listOutPutType = (outputType = []) => {
  return transform.transform(outputType, [
    'output_type_id', 'output_type_name',
    'area_id', 'area_name',
    'business_id', 'business_name', 'company_id','company_name',
  ]);
};
const listArea = (area = []) => {
  return transform.transform(area, [
    'area_id', 'area_name',
  ]);
};
const listBusiness = (area = []) => {
  return transform.transform(area, [
    'business_id', 'business_name', 'company_id','company_name',
  ]);
};
const listReviewlevel = (reviewLevel = []) => {
  return transform.transform(reviewLevel, [
    'price_review_level_id','price_apply_review_level_id', 'review_level_name', 'review_user','auto_review','is_review',
  ]);
};

const list = (campaigns = []) => {
  return transform.transform(campaigns, [
    'price_id', 'product_code', 'product_id', 'product_name', 'output_type_name',
    'area_name','company_name', 'business_name', 'price', 'price_vat', 'apply_time', 'is_review','is_output_for_web',
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
  detailPrices,
  detailProduct,
  list,
  listArea,
  listBusiness,
  listOutPutType,
  listReviewlevel,
  options,
};
