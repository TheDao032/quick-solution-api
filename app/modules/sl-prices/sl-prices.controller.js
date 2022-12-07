const priceService = require('./sl-prices.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const outputTypeService = require('../output-type/output-type.service');
const _ = require('lodash');
/**
 * Get list SL_PRICES
 */
const getListPrice = async (req, res, next) => {
  try {
    const serviceRes = await priceService.getListPrice(req.query);
    const {data, total, page, limit} = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};
const getListOutputType = async (req, res, next) => {
  try {
    const serviceRes = await outputTypeService.getListOutputType(req.query);
    let datatemp = serviceRes.getData().data;
    if(datatemp && datatemp.length)
    {

      for (const outputtype of datatemp) {
        outputtype.price_review_lv_users = [];
        // eslint-disable-next-line no-await-in-loop
        const serviceRes = await priceService.getListPriceReviewLVUser(outputtype.output_type_id);
        outputtype.price_review_lv_users = serviceRes.getData();
      }
    }
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a SL_PRICES
 */
const createPrice = async (req, res, next) => {
  try {
    req.body.price_id = null;

    const serviceRes = await priceService.createPrice(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SL_PRICES.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update the SL_PRICES
 */
const updatePrice = async (req, res, next) => {
  try {
    const bodyParams = req.body;
    const priceId = req.params.priceId;
    bodyParams.price_id = priceId;

    // Check slPrice exists
    const serviceResDetail = await priceService.detailPrice(priceId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update slPrice
    const serviceRes = await priceService.updatePrice(bodyParams);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SL_PRICES.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete the SL_PRICES
 */
const deletePrice = async (req, res, next) => {
  try {
    const priceId = req.params.priceId;

    // Check slPrice exists
    const serviceResDetail = await priceService.detailPrice(priceId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete slPrice
    const dataDelete = {
      'price_id': priceId,
      'user_name': req.auth.user_name,
    };
    const serviceRes = await priceService.deletePrice(dataDelete);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.SL_PRICES.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail the SL_PRICES
 */
const detailPrice = async (req, res, next) => {
  try {
    // Check slPrice exists
    const serviceRes = await priceService.detailPrice(req.params.productId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status the SL_PRICES
 */
const changeStatusPrice = async (req, res, next) => {
  try {
    const priceId = req.params.priceId;

    // Check slPrice exists
    const serviceResDetail = await priceService.detailPrice(priceId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    const dataUpdate = {
      'price_id': priceId,
      'is_active': req.body.is_active,
      'user_name': req.auth.user_name,
    };
    const serviceResUpdate = await priceService.changeStatusPrice(dataUpdate);
    if(serviceResUpdate.isFailed()) {
      return next(serviceResUpdate);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.SL_PRICES.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const approvedPriceReviewList = async (req, res, next) => {
  try {
    const serviceRes = await priceService.approvedPriceReviewList(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};

const listAreaByOutputType = async (req, res, next) => {
  try {
    const serviceRes = await priceService.listAreaByOutputType(req.query);
    const {data} = serviceRes.getData();

    return res.json(new ListResponse(data));
  } catch (error) {
    return next(error);
  }
};


const listBussinessByArea = async (req, res, next) => {
  try {
    const serviceRes = await priceService.listBussinessByArea(req.query);
    const {data, total, page, limit} = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListPrice,
  createPrice,
  updatePrice,
  deletePrice,
  detailPrice,
  changeStatusPrice,
  approvedPriceReviewList,
  getListOutputType,
  listAreaByOutputType,
  listBussinessByArea,
};
