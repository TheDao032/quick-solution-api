const express = require('express');
const validate = require('express-validation');
const rules = require('./user-timekeeping.rule');
const userTimeController = require('./user-timekeeping.controller');
const routes = express.Router();
const prefix = '/user-timekeeping';

// List user-timekeeping
routes.route('')
  .get(userTimeController.getList);

// Approved
routes.route('/approved-time/:timeKeepingId(\\d+)')
  .put(validate(rules.approvedTime), userTimeController.approvedTime);

// Approved multiple
routes.route('/approved-times')
  .put(validate(rules.approvedTimes), userTimeController.approvedTimes);

// Export excel
routes.route('/export-excel')
  .get(userTimeController.exportExcel);

module.exports = {
  prefix,
  routes,
};
