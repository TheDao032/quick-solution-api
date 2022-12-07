const userGroupService = require('./userGroup.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list SYS_USERGROUP
 */
const getListUserGroup = async (req, res, next) => {
  try {
    const serviceRes = await userGroupService.getListUserGroup(req.query);
    const {data, total, page, limit} = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a SYS_USERGROUP
 */
const createUserGroup = async (req, res, next) => {
  try {
    req.body.user_group_id = null;

    const serviceRes = await userGroupService.createUserGroup(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.USER_GROUP.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a userGroup
 */
const updateUserGroup = async (req, res, next) => {
  try {
    const userGroupId = req.params.userGroupId;
    req.body.user_group_id = userGroupId;

    // Check userGroup exists
    const serviceResDetail = await userGroupService.detailUserGroup(userGroupId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update userGroup
    const serviceRes = await userGroupService.updateUserGroup(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.USER_GROUP.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete SYS_USERGROUP
 */
const deleteUserGroup = async (req, res, next) => {
  try {
    const userGroupId = req.params.userGroupId;

    // Check userGroup exists
    const serviceResDetail = await userGroupService.detailUserGroup(userGroupId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete userGroup
    const serviceRes = await userGroupService.deleteUserGroup(userGroupId, req);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.USER_GROUP.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail SYS_USERGROUP
 */
const detailUserGroup = async (req, res, next) => {
  try {
    // Check userGroup exists
    const serviceRes = await userGroupService.detailUserGroup(req.params.userGroupId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status SYS_USERGROUP
 */
const changeStatusUserGroup = async (req, res, next) => {
  try {
    const userGroupId = req.params.userGroupId;

    // Check userGroup exists
    const serviceResDetail = await userGroupService.detailUserGroup(userGroupId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await userGroupService.changeStatusUserGroup(userGroupId, req.body);

    return res.json(new SingleResponse(null, RESPONSE_MSG.USER_GROUP.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('SYS_USERGROUP', req.query);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListUserGroup,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
  detailUserGroup,
  changeStatusUserGroup,
  getOptions,
};
