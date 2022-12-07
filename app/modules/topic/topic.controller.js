const topicService = require('./topic.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list
 */
const getListTopic = async (req, res, next) => {
  try {
    const serviceRes = await topicService.getListTopic(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailTopic = async (req, res, next) => {
  try {
    const serviceRes = await topicService.detailTopic(req.params.topicId);
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
const createTopic= async (req, res, next) => {
  try {
    req.body.topic_id = null;
    const serviceRes = await topicService.createTopicOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TOPIC.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateTopic = async (req, res, next) => {
  try {
    const topicId = req.params.topicId;
    req.body.topic_id = topicId;

    const serviceResDetail = await topicService.detailTopic(topicId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const serviceRes = await topicService.createTopicOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TOPIC.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusTopic = async (req, res, next) => {
  try {
    const topicId = req.params.topicId;

    const serviceResDetail = await topicService.detailTopic(topicId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await topicService.changeStatusTopic(topicId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.TOPIC.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteTopic = async (req, res, next) => {
  try {
    const topicId = req.params.topicId;

    // Check area exists
    const serviceResDetail = await topicService.detailTopic(topicId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await topicService.deleteTopic(topicId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.TOPIC.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListTopic,
  detailTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  changeStatusTopic,
};
