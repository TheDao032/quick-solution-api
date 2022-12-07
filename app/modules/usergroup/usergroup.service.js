const UserGroupClass = require('../usergroup/usergroup.class');
const UserGroupFunctionClass = require('../usergroup/user-group-function.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

/**
 * Get list SYS_USERGROUP
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListUserGroup = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const orderBy = apiHelper.getOrderBy(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('ORDERBYDES', orderBy)
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getFilterBoolean(queryParams, 'is_system'))
      .execute(PROCEDURE_NAME.SYS_USERGROUP_GETLIST);

    const userGroups = data.recordset;

    return new ServiceResponse(true, '', {
      'data': UserGroupClass.list(userGroups),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(userGroups),
    });
  } catch (e) {
    logger.error(e, {'function': 'userGroupService.getListUserGroup'});

    return new ServiceResponse(true, '', {});
  }
};

/**
 * Create SYS_USERGROUP
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createUserGroup = async (bodyParams = {}) => {
  return await createUserOrUpdate(bodyParams);
};

const updateUserGroup = async (bodyParams = {}) => {
  return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const datacheck =await pool.request()
    .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
    .input('USERGROUPNAME', apiHelper.getValueFromObject(bodyParams, 'user_group_name'))
    .execute(PROCEDURE_NAME.SYS_USERGROUP_CHECKNAME);
  if(datacheck.recordset[0].RESULT <=0) {
    return new ServiceResponse(false,RESPONSE_MSG.USER_GROUP.CHECK_NAME_FAILED);
  }
  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    // Save SYS_USERGROUP
    const requestUserGroup = new sql.Request(transaction);
    const resultUserGroup = await requestUserGroup
      .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
      .input('USERGROUPNAME', apiHelper.getValueFromObject(bodyParams, 'user_group_name'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_id'))
      .execute(PROCEDURE_NAME.SYS_USERGROUP_CREATEORUPDATE);
    // Get USERGROUPID
    const userGroupId = resultUserGroup.recordset[0].RESULT;

    /**
    // Delete SYS_USERGROUP_FUNCTION
    const requestUserGroupFunctionDelete = new sql.Request(transaction);
    const resultUserGroupFunction = await requestUserGroupFunctionDelete
      .input('USERGROUPID', userGroupId)
      .execute(PROCEDURE_NAME.SYS_USERGROUP_FUNCTION_DELETE);
    // If store can not delete data
    if (resultUserGroupFunction.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.USER_GROUP.DELETE_SYS_USERGROUP_FUNCTION_FAILED);
    }

    // Create SYS_USERGROUP_FUNCTION
    const dataUserGroupFunctions = apiHelper.getValueFromObject(bodyParams, 'user_group_functions', []);
    if (dataUserGroupFunctions.length) {
      for (let i = 0; i < dataUserGroupFunctions.length; i++) {
        let item = dataUserGroupFunctions[i];

        let requestUserGroupFunction = new sql.Request(transaction);
        let resultUserGroupFunction = await requestUserGroupFunction // eslint-disable-line no-await-in-loop
          .input('USERGROUPID', userGroupId)
          .input('FUNCTIONGROUPID', item.function_group_id)
          .input('FUNCTIONID', item.function_ids.join('|'))
          .input('ISFUNCTIONGROUP', item.is_function_group)
          .execute(PROCEDURE_NAME.SYS_USERGROUP_FUNCTION_CREATE);
        // Create SYS_USERGROUP_FUNCTION failed
        if (!resultUserGroupFunction.recordset[0].RESULT) {
          throw new Error(RESPONSE_MSG.USER_GROUP.SAVE_SYS_USERGROUP_FUNCTION_FAILED);
        }
      }
    }
    */

    // Commit transaction
    await transaction.commit();

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true,'',userGroupId);
  } catch (e) {
    logger.error(e, {'function': 'userGroupService.createUserOrUpdate'});

    // Rollback transaction
    await transaction.rollback();

    // return new ServiceResponse(false, e.message); // Return error without error information
    return new ServiceResponse(false, e); // Return error with error information
    // return new ServiceResponse(false, 'Process failed', null, e); // Return error with customize message
    // throw e; // Return error default
  }
};

const detailUserGroup = async (userGroupId) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('USERGROUPID', userGroupId)
      .execute(PROCEDURE_NAME.SYS_USERGROUP_GETBYID);

    let userGroupFunctions = data.recordsets[0];
    let userGroup = data.recordsets[1];

    // If exists SYS_USERGROUP
    if (userGroup && userGroup.length) {
      userGroup = UserGroupClass.detail(userGroup[0]);
      userGroupFunctions = UserGroupFunctionClass.list(userGroupFunctions);

      userGroup['user_group_functions'] = userGroupFunctions;
      return new ServiceResponse(true, '', userGroup);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'userGroupService.detailUserGroup'});

    return new ServiceResponse(false, e.message);
  }
};

const deleteUserGroup = async (userGroupId, req) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    // Delete user group function
    const requestUserGroupFunction = new sql.Request(transaction);
    const resultUserGroupFunction = await requestUserGroupFunction
      .input('USERGROUPID', userGroupId)
      .execute(PROCEDURE_NAME.SYS_USERGROUP_FUNCTION_DELETE);
    // If store can not delete data
    if (resultUserGroupFunction.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.USER_GROUP.DELETE_SYS_USERGROUP_FUNCTION_FAILED);
    }

    // Delete user group
    const requestUserGroup = new sql.Request(transaction);
    await requestUserGroup
      .input('USERGROUPID', userGroupId)
      .input('UPDATEDUSER', apiHelper.getAuthId(req))
      .execute(PROCEDURE_NAME.SYS_USERGROUP_DELETE);

    // Commit transaction
    await transaction.commit();

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'userGroupService.deleteUserGroup'});

    // Rollback transaction
    await transaction.rollback();

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusUserGroup = async (userGroupId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('USERGROUPID', userGroupId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_id'))
      .execute(PROCEDURE_NAME.SYS_USERGROUP_UPDATESTATUS);

    removeCacheOptions();

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'userGroupService.changeStatusUserGroup'});

    return new ServiceResponse(false);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.SYS_USERGROUP_OPTIONS);
};

module.exports = {
  getListUserGroup,
  createUserGroup,
  detailUserGroup,
  updateUserGroup,
  deleteUserGroup,
  changeStatusUserGroup,
};
