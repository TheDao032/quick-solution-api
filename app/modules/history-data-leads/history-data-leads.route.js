const express = require('express');
const validate = require('express-validation');
const historyDataleadsController = require('./history-data-leads.controller');
const routes = express.Router();
const prefix = '/history-data-leads';


// List StatusDataLeads
routes.route('')
  .get(historyDataleadsController.getListHistoryDataLeads);

module.exports = {
  prefix,
  routes,
};
