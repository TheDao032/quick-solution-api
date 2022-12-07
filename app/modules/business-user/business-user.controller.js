const businessUserService = require('./business-user.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list CRM_SEGMENT
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await businessUserService.getList(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a SYS_BUSINESS_USER
 */
const create = async (req, res, next) => {
  try {
    const serviceRes = await businessUserService.create(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BUSINESSUSER.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete SYS_BUSINESS_USER
 */
const deleteBU = async (req, res, next) => {
  try {
    // Check  exists
    const serviceResDetail = await businessUserService.detail(req.body);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Delete area
    const serviceRes = await businessUserService.deleteBU(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.BUSINESSUSER.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
  create,
  deleteBU,
};
