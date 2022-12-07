const Transform = require('../../common/helpers/transform.helper');

const template = {
  'output_type_id': '{{#? OUTPUTTYPEID}}',
  'output_type_name': '{{#? OUTPUTTYPENAME}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'vat_id': '{{#? VATID}}',
  'vat_name': '{{#? VATNAME}}',
  'vat_value': '{{#? VATVALUE}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_vat': '{{ISVAT ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
};
const list = (outputType = []) => {
  let transform = new Transform(template);
  return transform.transform(outputType, ['output_type_id', 'output_type_name','vat_id','vat_name',
    'is_vat','vat_value','company_id','company_name','area_id','area_name','created_date','is_active',
  ]);
};
const detail = (outputType) => {
  let transform = new Transform(template);
  return transform.transform(outputType, ['output_type_id', 'output_type_name','vat_id','vat_name',
    'vat_value','company_id','company_name','area_id','area_name','is_vat','description','is_active',
  ]);
};
const templateArea = {
  'area_id': '{{#? AREAID}}',
  'area_name': '{{#? AREANAME}}',
};
const listArea = (areas = []) => {
  let transform = new Transform(templateArea);
  return transform.transform(areas, ['area_id','area_name',
  ]);
};
const templatePriceReviewLVUser = {
  'output_type_id': '{{#? OUTPUTTYPEID}}',
  'price_review_level_id': '{{#? PRICEEREVIEWLEVELID}}',
  'price_review_level_name': '{{#? PRICEEREVIEWLEVELNAME}}',
  'department_id': '{{#? DEPARTMENTID}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'product_category_id': '{{#? PRODUCTCATEGORYID}}',
  'product_category_name': '{{#? PRODUCTCATEGORYNAME}}',
  'user_name': '{{#? USERNAME}}',
  'user_full_name': '{{#? USERFULLNAME}}',
  'is_auto_review': '{{ISAUTOREVIEW ? 1 : 0}}',
};
const listPriceReviewLVUser = (priceReviewLVUser = []) => {
  let transform = new Transform(templatePriceReviewLVUser);
  return transform.transform(priceReviewLVUser, ['output_type_id','price_review_level_id',
    'price_review_level_name','department_id','department_name','user_name','user_full_name',
    'is_auto_review','product_category_id','product_category_name',
  ]);
};
const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'vat_id':'{{#? VATID}}',
  'vat_name':'{{#? VATNAME}}',
  'vat_value':'{{#? VALUE}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name','vat_id','vat_name','vat_value']);
};

module.exports = {
  options,
  list,
  detail,
  listPriceReviewLVUser,
  listArea,
};
