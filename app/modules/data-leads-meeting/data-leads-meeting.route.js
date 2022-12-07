const express = require('express');
const validate = require('express-validation');
const dataLeadsMeetingController = require('./data-leads-meeting.controller');
const routes = express.Router();
const rules = require('./data-leads-meeting.rule');
const prefix = '/data-leads-meeting';
// List
routes.route('')
  .get(dataLeadsMeetingController.getListDataleadsMeeting);

// Create
routes.route('')
  .post(validate(rules.createDataLeadsMeeting),dataLeadsMeetingController.createDataleadsMeeting);

module.exports = {
  prefix,
  routes,
};
