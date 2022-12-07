const recruitService = require('./recruit.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list HR_RECRUIT
 */
const getListRecruit = async (req, res, next) => {
  try {
    const serviceRes = await recruitService.getListRecruit(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail HR_RECRUIT
 */
const detailRecruit = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await recruitService.detailRecruit(req.params.recruit_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a HR_RECRUIT
 */
const createRecruit = async (req, res, next) => {
  try {
    req.body.recruit_id = null;
    const serviceRes = await recruitService.createRecruitOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.RECRUIT.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a HR_RECRUIT
 */
const updateRecruit = async (req, res, next) => {
  try {
    const recruit_id = req.params.recruit_id;
    req.body.recruit_id = recruit_id;

    // Check recruit exists
    const serviceResDetail = await recruitService.detailRecruit(recruit_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update recruit
    const serviceRes = await recruitService.createRecruitOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.RECRUIT.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status HR_RECRUIT
 */
const changeStatusRecruit = async (req, res, next) => {
  try {
    const recruit_id = req.params.recruit_id;

    // Check userGroup exists
    const serviceResDetail = await recruitService.detailRecruit(recruit_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await recruitService.changeStatusRecruit(recruit_id, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.RECRUIT.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete HR_RECRUIT
 */
const deleteRecruit = async (req, res, next) => {
  try {
    const recruit_id = req.params.recruit_id;

    // Check company exists
    const serviceResDetail = await recruitService.detailRecruit(recruit_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete company
    const serviceRes = await recruitService.deleteRecruit(recruit_id, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.RECRUIT.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
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
    const serviceRes = await optionService('HR_RECRUIT', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListRecruit,
  detailRecruit,
  createRecruit,
  updateRecruit,
  changeStatusRecruit,
  deleteRecruit,
  getOptions,
};
