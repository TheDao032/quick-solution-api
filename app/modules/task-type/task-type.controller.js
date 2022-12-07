const taskTypeService = require('./task-type.service');
const taskWorkFollowService = require('../task-work-follow/task-work-follow.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list CRM_SEGMENT
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await taskTypeService.getListTaskType(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_SEGMENT
 */
const detail = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await taskTypeService.detail(req.params.taskTypeId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const serviceRes1 = await taskWorkFollowService.getListTaskWFollowByType(req.params.taskTypeId);
    if(serviceRes1.isFailed()) {
      return next(serviceRes1);
    }
    let datatemp = serviceRes.getData();
    datatemp.list_task_work_follow = serviceRes1.getData();

    return res.json(new SingleResponse(datatemp));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_AREA
 */
const createTaskType = async (req, res, next) => {
  try {
    req.body.task_type_id = null;
    const serviceRes = await taskTypeService.createTaskTypeOrUpdates(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TASKTYPE.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a MD_AREA
 */
const updateTaskType = async (req, res, next) => {
  try {
    const taskTypeId = req.params.taskTypeId;
    req.body.task_type_id = taskTypeId;

    // Check segment exists
    const serviceResDetail = await taskTypeService.detail(taskTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await taskTypeService.createTaskTypeOrUpdates(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TASKTYPE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status MD_AREA
 */
const changeStatusTaskType = async (req, res, next) => {
  try {
    const taskTypeId = req.params.taskTypeId;

    // Check userGroup exists
    const serviceResDetail = await taskTypeService.detail(taskTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await taskTypeService.changeStatusTaskType(taskTypeId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.TASKTYPE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteTaskType = async (req, res, next) => {
  try {
    const id = req.params.taskTypeId;

    // Check area exists
    const serviceResDetail = await taskTypeService.detail(id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await taskTypeService.deleteTaskType(id, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.TASKTYPE.DELETE_SUCCESS));
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
    const serviceRes = await optionService('CRM_TASKTYPE', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
const getOptionForList = async (req, res, next) => {
  try {
    req.query.user_groups=req.auth.user_groups;
    req.query.isAdministrator =req.auth.isAdministrator;
    const typeFuctions = ['EDITFUNCTIONID','DELETEFUNCTIONID'];
    const serviceRes = await taskTypeService.getOptionsAll(typeFuctions,req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
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
const getOptionForCreate = async (req, res, next) => {
  try {
    req.query.isAdministrator =req.auth.isAdministrator;
    req.query.user_groups=req.auth.user_groups;
    const typeFuctions = ['ADDFUNCTIONID'];
    const serviceRes = await taskTypeService.getOptionsAll(typeFuctions,req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getList,
  detail,
  createTaskType,
  updateTaskType,
  changeStatusTaskType,
  deleteTaskType,
  getOptions,
  getOptionForList,
  getOptionForCreate,
};
