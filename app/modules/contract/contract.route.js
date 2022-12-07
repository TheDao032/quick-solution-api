const express = require('express');
const validate = require('express-validation');
const rules = require('./contract.rule');
const contractController = require('./contract.controller');
const routes = express.Router();
const prefix = '/contract';

// List contract
routes.route('')
  .get(contractController.getListContract);

// Create new a contract
routes.route('')
  .post(validate(rules.createContract), contractController.createContract);

// Update a contract
routes.route('/:contract_id(\\d+)')
  .put(validate(rules.updateContract), contractController.updateContract);

// Delete a contract
routes.route('/:contract_id(\\d+)')
  .delete(contractController.deleteContract);

// Detail a contract
routes.route('/:contract_id(\\d+)')
  .get(contractController.detailContract);

// approved
routes.route('/:contract_id(\\d+)/approved')
  .put(validate(rules.approvedContract), contractController.approvedContract);
// transfer
routes.route('/:contract_id(\\d+)/transfer')
  .put(validate(rules.transferContract), contractController.transferContract);
// freeze
routes.route('/:contract_id(\\d+)/freeze')
  .put(validate(rules.freezeContract), contractController.freezeContract);
// product info
routes.route('/product-info')
  .post(contractController.getProductInfo);
module.exports = {
  prefix,
  routes,
};
