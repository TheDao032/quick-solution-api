const taskService = require('./task.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list CRM_SEGMENT
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await taskService.getListTask(req.body.auth_name, req.query);
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
    const serviceRes = await taskService.detail(req.params.taskId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const datatemp = serviceRes.getData();
    return res.json(new SingleResponse(datatemp));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_AREA
 */
const createTask = async (req, res, next) => {
  try {
    req.body.task_id = null;
    const serviceRes = await taskService.createTaskOrUpdates(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TASK.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a MD_AREA
 */
const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    req.body.task_id = taskId;

    // Check segment exists
    const serviceResDetail = await taskService.detail(taskId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await taskService.createTaskOrUpdates(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TASK.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status MD_AREA
 */
const changeStatusTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;

    // Check userGroup exists
    const serviceResDetail = await taskService.detail(taskId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await taskService.changeStatusTask(taskId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.TASK.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.taskId;

    // Check area exists
    const serviceResDetail = await taskService.detail(id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await taskService.deleteTask(id, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.TASK.DELETE_SUCCESS));
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
    const serviceRes = await optionService('CRM_TASK', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getList,
  detail,
  createTask,
  updateTask,
  changeStatusTask,
  deleteTask,
  getOptions,
};
