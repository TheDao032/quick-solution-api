const express = require('express');
const validate = require('express-validation');
const bookingController = require('./booking.controller');
const routes = express.Router();
const rules = require('./booking.rule');
const prefix = '/booking';


// Get List
routes.route('')
  .get(bookingController.getListBooking);

// Get List All
routes.route('/get-options')
  .get(bookingController.getListAllBooking);

// Get List Booking Detail
routes.route('/:bookingId/get-list-booking-detail')
  .get(bookingController.getListBookingDetail);

// Get List Product
routes.route('/get-list-product')
  .get(bookingController.getListProduct);

// Detail a area
routes.route('/:bookingId(\\d+)')
  .get(bookingController.detailBooking);

// Update a area
routes.route('/:bookingId(\\d+)')
  .put(validate(rules.updateBooking),bookingController.updateBooking);

// Insert List Booking Detail
routes.route('/list-booking-detail')
  .post(validate(rules.insertListBookingDetail),bookingController.createListBookingDetail);

// Insert List Booking Detail
routes.route('/cart')
  .post(validate(rules.insertCart),bookingController.createCart);

// Insert Order
routes.route('/order')
  .post(validate(rules.insertOrder),bookingController.createOrder);

// Insert OrderDetail
routes.route('/order-detail')
  .post(validate(rules.insertOrderDetail),bookingController.createOrderDetail);

// Insert OrderPromotion
routes.route('/order-promotion')
  .post(validate(rules.insertOrderPromotion),bookingController.createOrderPromotion);

// Change status booking
routes.route('/:bookingId/change-status')
  .put(validate(rules.changeStatus),bookingController.changeStatusBooking);

// Delete a area
routes.route('/:bookingId(\\d+)')
  .delete(bookingController.deleteBooking);

module.exports = {
  prefix,
  routes,
};
