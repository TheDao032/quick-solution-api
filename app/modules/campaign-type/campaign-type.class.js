const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  'campaign_type_id': '{{#? CAMPAIGNTYPEID}}',
  'campaign_type_name': '{{#? CAMPAIGNTYPENAME}}',
  'add_function_id': '{{#? ADDFUNCTIONID}}',
  'edit_function_id': '{{#? EDITFUNCTIONID}}',
  'delete_function_id': '{{#? DELETEFUNCTIONID}}',
  'order_index': '{{#? ORDERINDEX}}',
  'is_auto_review': '{{ISAUTOREVIEW ? 1 : 0}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'campaign_rl_id': '{{#? CAMPAIGNREVIEWLEVELID}}',
  'campaign_rl_name': '{{#? CAMPAIGNREVIEWLEVELNAME}}',
  'user_name': '{{#? USERNAME}}',
  'full_name': '{{#? FULLNAME}}',
  'user_id': '{{#? USERID}}',
  'default_picture_url': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
  'created_date': '{{#? CREATEDDATE}}',
  'add_function_name': '{{#? ADDFUNCTIONNAME}}',
  'edit_function_name': '{{#? EDITFUNCTIONNAME}}',
  'edit_all_function_id': '{{#? EDITALLFUNCTIONID}}',
  'edit_all_function_name': '{{#? EDITALLFUNCTIONNAME}}',
  'delete_function_name': '{{#? DELETEFUNCTIONNAME}}',
  'delete_all_function_id': '{{#? DELETEALLFUNCTIONID}}',
  'delete_all_function_name': '{{#? DELETEALLFUNCTIONNAME}}',
};

let transform = new Transform(template);

const detail = (campaignType) => {
  return transform.transform(campaignType, [
    'campaign_type_id','campaign_type_name','add_function_id','add_function_name','edit_function_id',
    'edit_function_name','delete_function_id','order_index','is_auto_review', 'description', 'is_active','edit_all_function_id',
    'edit_all_function_name','delete_function_name','delete_all_function_id','delete_all_function_name',
  ]);
};

const list = (campaignType = []) => {
  return transform.transform(campaignType, [
    'campaign_type_id','campaign_type_name', 'description', 'is_active', 'add_function_id', 'edit_function_id', 'delete_function_id',
    'created_date', 'is_auto_review',
  ]);
};

const listRlUser = (campaignRlUser = []) => {
  return transform.transform(campaignRlUser, [
    'campaign_rl_id','campaign_rl_name', 'user_name', 'full_name','user_id','default_picture_url',
  ]);
};

//function
const tempalteFunction={
  'function_id': '{{#? FUNCTIONID}}',
  'function_alias': '{{#? FUNCTIONALIAS}}',
};

let transformFunction = new Transform(tempalteFunction);

const listFunctions = (functions = []) => {
  return transformFunction.transform(functions, [
    'function_id',
  ]);
};
// options
const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'is_auto_review': '{{ISAUTOREVIEW ? 1 : 0}}',
  'add': '{{ADD ? 1 : 0}}',
  'edit': '{{EDIT ? 1 : 0}}',
  'delete': '{{DELETE ? 1 : 0}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name','is_auto_review','add','edit','delete']);
};
module.exports = {
  list,
  detail,
  listFunctions,
  options,
  listRlUser,
};
