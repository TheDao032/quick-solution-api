const Transform = require('../../common/helpers/transform.helper');

const template = {
  'stt': '{{#? STT}}',
  'register_setup_id': '{{#? REGISTERSETUPID}}',
  'setup_service_id': '{{#? SETUPSERVICEID}}',
  'full_name': '{{#? FULLNAME}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'email': '{{#? EMAIL}}',
  'address': '{{#? ADDRESS}}',
  'content_registration': '{{#? CONTENTREGISTRATION}}',
  'setup_service_title': '{{#? SETUPSERVICETITLE}}',
  'data_leads_id': '{{#? DATALEADSID}}',
  'user': '{{#? USER}}',
  'create_date': '{{#? CREATEDDATE}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const templateSetup = {
  'id': '{{#? SETUPSERVICEID}}',
  'name': '{{#? SETUPSERVICETITLE}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'register_setup_id','setup_service_id','full_name','phone_number','email','address','content_registration','setup_service_title','data_leads_id','user','create_date',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'stt','register_setup_id','full_name','phone_number','email','address','setup_service_title','user',
  ]);
};

let transformSetup = new Transform(templateSetup);
const listSetupService = (area) => {
  return transformSetup.transform(area, [
    'id', 'name',
  ]);
};
module.exports = {
  list,
  detail,
  listSetupService,
};
