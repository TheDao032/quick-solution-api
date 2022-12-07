const Transform = require('../../common/helpers/transform.helper');

const template = {
  'contract_type_id': '{{#? CONTRACTTYPEID}}',
  'contract_type_name': '{{#? CONTRACTTYPENAME}}',
  'created_date': '{{#? CREATEDDATE}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'contract_type_id','contract_type_name','created_date',
    'description', 'is_active',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'contract_type_id','contract_type_name','created_date',
    'description', 'is_active',
  ]);
};

module.exports = {
  list,
  detail,
};
