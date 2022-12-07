const segmentService = require('./segment.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list CRM_SEGMENT
 */
const getListSegment = async (req, res, next) => {
  try {
    const serviceRes = await segmentService.getListSegment(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_SEGMENT
 */
const detailSegment = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await segmentService.detailSegment(req.params.segmentId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a CRM_SEGMENT
 */
const createSegment = async (req, res, next) => {
  try {
    req.body.segment_id = null;
    const serviceRes = await segmentService.createSegmentOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SEGMENT.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a CRM_SEGMENT
 */
const updateSegment = async (req, res, next) => {
  try {
    const segmentId = req.params.segmentId;
    req.body.segment_id = segmentId;

    // Check segment exists
    const serviceResDetail = await segmentService.detailSegment(segmentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await segmentService.createSegmentOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SEGMENT.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status CRM_SEGMENT
 */
const changeStatusSegment = async (req, res, next) => {
  try {
    const segmentId = req.params.segmentId;

    // Check userGroup exists
    const serviceResDetail = await segmentService.detailSegment(segmentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await segmentService.changeStatusSegment(segmentId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.SEGMENT.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteSegment = async (req, res, next) => {
  try {
    const segmentId = req.params.segmentId;

    // Check company exists
    const serviceResDetail = await segmentService.detailSegment(segmentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete company
    const serviceRes = await segmentService.deleteSegment(segmentId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.SEGMENT.DELETE_SUCCESS));
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
    const serviceRes = await optionService('CRM_SEGMENT', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListSegment,
  detailSegment,
  createSegment,
  updateSegment,
  changeStatusSegment,
  deleteSegment,
  getOptions,
};
