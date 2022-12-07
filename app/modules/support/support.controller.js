const supportService = require('./support.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list
 */
const getListSupport = async (req, res, next) => {
  try {
    const serviceRes = await supportService.getListSupport(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list all MD_STORE
 */
const getListAllSupport = async (req, res, next) => {
  try {
    const serviceRes = await supportService.getListAllSupport(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailSupport = async (req, res, next) => {
  try {
    const serviceRes = await supportService.detailSupport(req.params.supportId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusSupport = async (req, res, next) => {
  try {
    const supportId = req.params.supportId;

    const serviceResDetail = await supportService.detailSupport(supportId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await supportService.changeStatusSupport(supportId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.SUPPORT.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteSupport = async (req, res, next) => {
  try {
    const supportId = req.params.supportId;

    // Check area exists
    const serviceResDetail = await supportService.detailSupport(supportId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await supportService.deleteSupport(supportId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.SUPPORT.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListSupport,
  detailSupport,
  deleteSupport,
  getListAllSupport,
  changeStatusSupport,
};
