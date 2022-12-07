const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'candidate_id': '{{#? CANDIDATEID}}',
  'recruit_id': '{{#? RECRUITID}}',
  'recruit_title': '{{#? RECRUITTITLE}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'position_id': '{{#? POSITIONID}}',
  'position_name': '{{#? POSITIONNAME}}',
  'candidate_full_name': '{{#? CANDIDATEFULLNAME}}',
  'birthday': '{{#? BIRTHDAY}}',
  'gender': '{{#? GENDER}}',
  'gender_name': '{{#? GENDERNAME}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'introduction': '{{#? INTRODUCTION}}',
  'email': '{{#? EMAIL}}',
  'communications': '{{#? COMMUNICATIONS}}',
  'hr_description': '{{#? HRDESCRIPTION}}',
  'status': '{{#? STATUS}}',
  'attachment_name': '{{#? ATTACHMENTNAME}}',
  'attachment_path': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
  'apply_count': '{{#? APPLYCOUNT}}',
  'user': '{{#? USER}}',
  'create_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
};

const templateOption = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const templateAttachment = {
  'candidate_id': '{{#? CANDIDATEID}}',
  'candidate_attachment_id': '{{#? CANDIDATEATTACHMENTID}}',
  'attachment_name': '{{#? ATTACHMENTNAME}}',
  'attachment_path': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'candidate_id','recruit_id','recruit_title','business_id','business_name','position_id','position_name',
    'candidate_full_name','birthday', 'gender', 'gender_name','phone_number','introduction','email','hr_description','status','attachment_name','attachment_path','create_date','is_active',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'candidate_id','candidate_full_name','gender','birthday','phone_number','email','communications','introduction','recruit_title','position_name','business_name','status','hr_description','apply_count','user','create_date',
    'is_active',
  ]);
};

const listAttachment = (areas = []) => {
  let transform = new Transform(templateAttachment);

  return transform.transform(areas, [
    'candidate_id','candidate_attachment_id','attachment_name','attachment_path',
  ]);
};

const listOption = (area = []) => {
  let transform = new Transform(templateOption);

  return transform.transform(area, [
    'id','name',
  ]);
};

module.exports = {
  list,
  detail,
  listOption,
  listAttachment,
};
