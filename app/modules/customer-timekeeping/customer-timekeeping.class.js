const Transform = require('../../common/helpers/transform.helper');
const template = {
  'membership_id': '{{#? MEMBERSHIPID}}',
  'user_name': '{{#? USERNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'contract_id': '{{#? CONTRACTID}}',
  'timekeeping': '{{#? TIMEKEEPING}}',
  'time': '{{#? TIME}}',
  'is_complete_trainpt': '{{ISCOMPLETETRAINPT ? 1 : 0}}',
  'pt_user': '{{#? PTUSER}}',
};

let transform = new Transform(template);

const list = (users = []) => {
  return transform.transform(users, [
    'membership_id', 'user_name','business_id','business_name','contract_id','timekeeping',
    'time','is_complete_trainpt','pt_user',
  ]);
};

module.exports = {
  list,
};
