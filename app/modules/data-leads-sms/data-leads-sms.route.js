const express = require('express');
const validate = require('express-validation');
const taskDataLeadsSmsController = require('./data-leads-sms.controller');
const routes = express.Router();
const rules = require('./data-leads-sms.rule');
const prefix = '/data-leads-sms';

// List
routes.route('')
  .get(taskDataLeadsSmsController.getListDataleadsSms);

// Create
routes.route('')
  .post(validate(rules.create),taskDataLeadsSmsController.createDataLeadsSms);

// SendSMS List phone
routes.route('/send-sms')
  .post(validate(rules.sendSmsList),taskDataLeadsSmsController.sendSMSList);
module.exports = {
  prefix,
  routes,
};
