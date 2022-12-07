const express = require('express');
const validate = require('express-validation');
const rules = require('./sl-prices.rule');
const slPricesController = require('./sl-prices.controller');
const routes = express.Router();
const prefix = '/sl-prices';

// List slPrice
routes.route('')
  .get(slPricesController.getListPrice);

// List slPrice
routes.route('/list-output-type')
  .get(slPricesController.getListOutputType);

routes.route('/list-area-by-output-type')
  .get(slPricesController.listAreaByOutputType);

routes.route('/list-business-by-area')
  .get(slPricesController.listBussinessByArea);
// Create new a slPrice
routes.route('')
  .post(validate(rules.createPrice), slPricesController.createPrice);

// Update a slPrice
routes.route('/:priceId(\\d+)')
  .put(validate(rules.updatePrice), slPricesController.updatePrice);

// Delete a slPrice
routes.route('/:priceId(\\d+)')
  .delete(slPricesController.deletePrice);

// Detail a slPrice
routes.route('/:productId(\\d+)')
  .get(slPricesController.detailPrice);

// Change status a slPrice
routes.route('/:priceId(\\d+)/change-status')
  .put(validate(rules.changeStatusPrice), slPricesController.changeStatusPrice);

routes.route('/:priceId(\\d+)/approved-review-list')
  .put(validate(rules.approvedPriceReviewList), slPricesController.approvedPriceReviewList);

module.exports = {
  prefix,
  routes,
};
