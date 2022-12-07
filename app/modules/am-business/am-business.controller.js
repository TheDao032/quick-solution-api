const httpStatus = require('http-status');
const amBusinessService = require('./am-business.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListAMBusiness = async (req, res, next) => {
  try {
    const serviceRes = await amBusinessService.getListAMBusiness(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Create new a AM_Business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createAMBusiness= async (req, res, next) => {
  try {
    // Insert AMBusiness
    const serviceRes = await amBusinessService.createAMBusiness(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Update a AM_Business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateAMBusiness = async (req, res, next) => {
  try {
    const business_id = req.params.business_id;
    // Check AMBusiness exists
    const serviceResDetail = await amBusinessService.detailAMBusiness(business_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update AMBusiness
    const serviceRes = await amBusinessService.updateAMBusiness(req.body,business_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
/**
 * delete a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteAMBusiness= async (req, res, next) => {
  try {

    const business_id = req.params.business_id;
    const auth_id = apiHelper.getAuthId(req);
    // Check AMBUSINESS exists
    const serviceResDetail = await amBusinessService.detailAMBusiness(business_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Delete AMBUSINESS
    const serviceRes = await amBusinessService.deleteAMBusiness(business_id,auth_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
/**
 * detail a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const detailAMBusiness = async (req, res, next) => {
  try {
    const business_id = req.params.business_id;

    // Check AMBUSINESS exists
    const serviceRes = await amBusinessService.detailAMBusiness(business_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
  /**
 * change status a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const changeStatusAMBusiness = async (req, res, next) => {
  try {
    const business_id = req.params.business_id;
    const auth_id = apiHelper.getAuthId(req);
    const is_active = apiHelper.getValueFromObject(req.body, 'is_active');
    // Check function exists
    const serviceResDetail = await amBusinessService.detailAMBusiness(business_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const serviceRes = await amBusinessService.changeStatusAMBusiness(business_id,auth_id,is_active);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('AM_BUSINESS', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionsByUser = async (req, res, next) => {
  try {
    if(Number(req.auth.isAdministrator) === 1)
    {
      const serviceRes = await optionService('AM_BUSINESS', req.query);
      return res.json(new SingleResponse(serviceRes.getData()));
    }
    else
    {
      req.query.auth_id = req.body.auth_id;
      const serviceRes = await amBusinessService.getOptionsAll(req.query);
      return res.json(new SingleResponse(serviceRes.getData()));
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListAMBusiness,
  createAMBusiness,
  updateAMBusiness,
  deleteAMBusiness,
  detailAMBusiness,
  changeStatusAMBusiness,
  getOptions,
  getOptionsByUser,
};
