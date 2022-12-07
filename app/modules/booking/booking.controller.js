const bookingService = require('./booking.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list MD_STORE
 */
const getListBooking = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.getListBooking(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getListBookingDetail = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.getListBookingDetail(req.params.bookingId);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list all MD_STORE
 */
const getListAllBooking = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.getListAllBooking(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const getListProduct = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.getListProduct(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail MD_STORE
 */
const detailBooking = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.detailBooking(req.params.bookingId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    req.body.bookingId = bookingId;

    const serviceResDetail = await bookingService.detailBooking(bookingId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await bookingService.createBookingOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BOOKING.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create List Booking Detail
 */
const createListBookingDetail = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.createListBookingDetailOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BOOKING.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create Order
 */
const createOrder = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.createOrderOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BOOKING.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create OrderDetail
 */
const createOrderDetail = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.createOrderDetailOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BOOKING.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create OrderPromotion
 */
const createOrderPromotion = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.createOrderPromotionOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BOOKING.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


/**
 * Create Cart
 */
const createCart = async (req, res, next) => {
  try {
    const serviceRes = await bookingService.createCartOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BOOKING.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;

    const serviceResDetail = await bookingService.detailBooking(bookingId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await bookingService.changeStatusBooking(bookingId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.BOOKING.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;

    const serviceResDetail = await bookingService.detailBooking(bookingId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await bookingService.deleteBooking(bookingId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.BOOKING.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListBooking,
  detailBooking,
  updateBooking,
  deleteBooking,
  getListBookingDetail,
  getListProduct,
  createListBookingDetail,
  createCart,
  getListAllBooking,
  changeStatusBooking,
  createOrder,
  createOrderDetail,
  createOrderPromotion,
};
