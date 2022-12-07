const newsStatusService = require('./news-status.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list 
 */
const getListNewsStatus = async (req, res, next) => {
  try {
    const serviceRes = await newsStatusService.getListNewsStatus(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list all MD_STORE
 */
const getListAllNewsStatus = async (req, res, next) => {
  try {
    const serviceRes = await newsStatusService.getListAllNewsStatus(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailNewsStatus = async (req, res, next) => {
  try {
    const serviceRes = await newsStatusService.detailNewsStatus(req.params.newsStatusId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createNewsStatus = async (req, res, next) => {
  try {
    req.body.news_status_id = null;
    const serviceRes = await newsStatusService.createNewsStatusOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWSSTATUS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateNewsStatus = async (req, res, next) => {
  try {
    const newsStatusId = req.params.newsStatusId;
    req.body.news_status_id = newsStatusId;

    const serviceResDetail = await newsStatusService.detailNewsStatus(newsStatusId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await newsStatusService.createNewsStatusOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWSSTATUS.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusNewsStatus = async (req, res, next) => {
  try {
    const newsStatusId = req.params.newsStatusId;

    const serviceResDetail = await newsStatusService.detailNewsStatus(newsStatusId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await newsStatusService.changeStatusNewsStatus(newsStatusId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.NEWSSTATUS.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteNewsStatus = async (req, res, next) => {
  try {
    const newsStatusId = req.params.newsStatusId;

    const serviceResDetail = await newsStatusService.detailNewsStatus(newsStatusId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await newsStatusService.deleteNewsStatus(newsStatusId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.NEWSSTATUS.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const checkOrderIndexNewsStatus = async (req, res, next) => {
  try {
    const serviceRes = await newsStatusService.checkOrderIndexNewsStatus(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListNewsStatus,
  detailNewsStatus,
  createNewsStatus,
  updateNewsStatus,
  deleteNewsStatus,
  changeStatusNewsStatus,
  getListAllNewsStatus,
  checkOrderIndexNewsStatus,
};
