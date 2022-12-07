const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
  'is_compele_review': '{{#? ISCOMPELEREVIEW}}',
};

const options = (manufacturer = []) => {
  let transform = new Transform(templateOptions);

  return transform.transform(manufacturer, ['id', 'name','is_compele_review']);
};


module.exports = {
  options,
};
