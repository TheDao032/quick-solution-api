const taskWorkFollowService = require('./task-work-follow.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get detail CRM_SEGMENT
 */
const detailTaskWorkFollow = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await taskWorkFollowService.detailTaskWorkFollow(req.params.taskWorkFollowId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_AREA
 */
const createTaskWorkFollow= async (req, res, next) => {
  try {
    req.body.task_work_follow_id = null;
    const serviceRes = await taskWorkFollowService.createOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TASKWORKFOLLOW.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a MD_AREA
 */
const updateTaskWorkFollow = async (req, res, next) => {
  try {
    const Id = req.params.taskWorkFollowId;
    req.body.task_work_follow_id = Id;

    // Check segment exists
    const serviceResDetail = await taskWorkFollowService.detailTaskWorkFollow(Id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await taskWorkFollowService.createOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TASKWORKFOLLOW.UPDATE_SUCCESS));
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
    const serviceRes = await taskWorkFollowService.getOptionsAll(req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  detailTaskWorkFollow,
  createTaskWorkFollow,
  updateTaskWorkFollow,
  getOptions,
};
