const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'product_comment_id': '{{#? PRODUCTCOMMENTID}}',
  'product_id': '{{#? PRODUCTID}}',
  'comment_reply_id': '{{#? COMMENTREPLYID}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'email': '{{#? EMAIL}}',
  'user_comment': '{{#? USERCOMMENT}}',
  'full_name': '{{#? FULLNAME}}',
  'is_staff': '{{ISSTAFF ? 1 : 0}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'ratting_values': '{{#? RATTINGVALUES}}',
  'content_comment': '{{#? CONTENTCOMMENT}}',
  'create_date': '{{#? CREATEDDATE}}',
  'user': '{{#? CREATEDUSER}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detailComment = (area) => {
  return transform.transform(area, [
    'product_comment_id','product_id','comment_reply_id','phone_number','email','user_comment','full_name','is_staff',
    'product_name','content_comment','create_date','is_active','user',
  ]);
};

const detailCommentReply = (area) => {
  return transform.transform(area, [
    'product_comment_id','product_id','comment_reply_id','phone_number','email','user_comment','full_name','is_staff',
    'product_name','content_comment','create_date','is_active','user',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'product_comment_id','comment_reply_id','user_comment','phone_number','email','content_comment','ratting_values','is_staff','is_active','user','create_date',
  ]);
};

const templateProduct = {
  'product_id': '{{#? PRODUCTID}}',
  'manufacturer_id': '{{#? MANUFACTURERID}}',
  'manufacturer_name': '{{#? MANUFACTURERNAME}}',
  'product_category_id': '{{#? PRODUCTCATEGORYID}}',
  'category_name': '{{#? CATEGORYNAME}}',
  'product_code': '{{#? PRODUCTCODE}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'product_name_show_web': '{{#? PRODUCTNAMESHOWWEB}}',
  'product_imei': '{{#? PRODUCTIMEI}}',
  'model_id': '{{#? MODELID}}',
  'model_name': '{{#? MODELNAME}}',
  'product_content_detail': '{{#? PRODUCTCONTENTDETAIL}}',
  'lot_number': '{{#? LOTNUMBER}}',
  'origin_id': '{{#? ORIGINID}}',
  'origin_name': '{{#? ORIGINNAME}}',
  'descriptions': '{{#? DESCRIPTIONS}}',
  'quantity': '{{#? QUANTITY}}',
  'price': '{{#? PRICE}}',
  'short_description': '{{#? SHORTDESCRIPTION}}',
  'note': '{{#? NOTE}}',
  'url_product': '{{#? URLPRODUCT}}',
  'is_show_web': '{{ISSHOWWEB ? 1 : 0}}',
  'is_service': '{{ISSERVICE ? 1 : 0}}',
  'is_high_light': '{{ISHIGHLIGHT ? 1 : 0}}',
  'is_sell_well': '{{ISSELLWELL ? 1 : 0}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'status_product_id': '{{#? STATUSPRODUCTID}}',
  'status_product_name': '{{#? STATUSPRODUCTNAME}}',
  'view': '{{VIEW ? 1 : 0}}',
  'add': '{{ADD ? 1 : 0}}',
  'del': '{{DEL ? 1 : 0}}',
  'edit': '{{EDIT ? 1 : 0}}',
};

const listProduct = (products = []) => {
  let transform = new Transform(templateProduct);

  return transform.transform(products, [
    'product_id','manufacturer_id', 'manufacturer_name','product_category_id','category_name','product_name_show_web',
    'product_code','product_name', 'product_imei','model_id','model_name', 'origin_id',
    'origin_name','quantity','price', 'is_show_web','is_service','is_active','created_date','status_product_id','status_product_name',
    'view','add','edit','del',
  ]);
};

const detailProduct = (product) => {
  let transform = new Transform(templateProduct);

  return transform.transform(product, [
    'product_id','product_code','product_name','model_id',
    'model_name','url_product',
  ]);
};

const templatePicture = {
  'product_picture_id': '{{#? PRODUCTPICTUREID}}',
  'picture_url': `${config.domain_cdn}{{PICTUREURL}}`,
  'picture_alias': '{{#? PICTUREALIAS}}',
  'is_default': '{{ISDEFAULT ? 1 : 0}}',
  'product_id': '{{#? PRODUCTID}}',
};
const listPicture = (pictures = []) => {
  let transform = new Transform(templatePicture);
  return transform.transform(pictures, [
    'product_id','picture_url', 'picture_alias','is_default','product_picture_id',
  ]);
};

const templateBussiness = {
  'product_id': '{{#? PRODUCTID}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
};
const listBussiness = (business=[]) => {
  let transform = new Transform(templateBussiness);
  return transform.transform(business, [
    'product_id','business_id', 'business_name',
  ]);
};

const templateAttributeValues = {
  'product_attribute_values_id': '{{#? PRODUCTATTRIBUTEVALUESID}}',
  'product_attribute_id': '{{#? PRODUCTATTRIBUTEID}}',
  'attribute_name': '{{#? ATTRIBUTENAME}}',
  'attribute_values': '{{#? ATTRIBUTEVALUES}}',
  'product_id': '{{#? PRODUCTID}}',
  'unit_id': '{{#? UNITID}}',
  'unit_name': '{{#? UNITNAME}}',
};
const listAttributeValues = (attributeValues=[]) => {
  let transform = new Transform(templateAttributeValues);
  return transform.transform(attributeValues, [
    'product_id','product_attribute_values_id', 'product_attribute_id', 'attribute_name', 'attribute_values',
    'unit_id','unit_name',
  ]);
};

module.exports = {
  list,
  detailComment,
  detailCommentReply,
  listProduct,
  listBussiness,
  detailProduct,
  listPicture,
  listAttributeValues,
};
