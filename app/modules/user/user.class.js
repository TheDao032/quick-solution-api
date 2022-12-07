const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  'user_id': '{{#? USERID}}',
  'full_name': '{{#? FULLNAME}}',
  'email': '{{#? EMAIL}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'phone_number_1': '{{#? PHONENUMBER_1}}',
  'address': '{{#? ADDRESS}}',
  'address_full': '{{#? ADDRESSFULL}}',
  'gender': '{{ GENDER ? 1 : 0 }}',
  'default_picture_url': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
  'user_name': '{{#? USERNAME}}',
  'password': '{{#? PASSWORD}}',
  'first_name': '{{#? FIRSTNAME}}',
  'last_name': '{{#? LASTNAME}}',
  'birthday': '{{#? BIRTHDAY }}',
  'province_id': '{{#? PROVINCEID}}',
  'district_id': '{{#? DISTRICTID}}',
  'ward_id': '{{#? WARDID}}',
  'country_id': '{{#? COUNTRYID}}',
  'city_id': '{{#? CITYID}}',
  'description': '{{#? DESCRIPTION}}',
  'department_id': '{{#? DEPARTMENTID}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'position_id': '{{#? POSITIONID}}',
  'position_name': '{{#? POSITIONNAME}}',
  'user_groups': '{{#? USERGROUPS.split("|")}}',
  'about_me': '{{#? ABOUTME}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'created_user': '{{#? CREATEDUSER}}',
};

let transform = new Transform(template);

const basicInfo = (user) => {
  return transform.transform(user, ['user_id', 'user_name', 'password', 'full_name', 'email', 'phone_number']);
};

const detail = (user) => {
  return transform.transform(user, [
    'user_id', 'full_name', 'email', 'phone_number', 'address', 'gender', 'default_picture_url',
    'user_name', 'first_name', 'last_name', 'birthday', 'phone_number_1',
    'province_id', 'district_id', 'country_id', 'city_id', 'description', 'department_id',
    'position_id', 'about_me', 'user_groups', 'ward_id',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'user_id', 'user_name', 'full_name', 'department_name', 'position_name', 'gender', 'phone_number',
    'address', 'email', 'address_full',
  ]);
};

const generateUsername = (user) => {
  return transform.transform(user, ['user_name']);
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
  basicInfo,
  detail,
  list,
  generateUsername,
  options,
};
