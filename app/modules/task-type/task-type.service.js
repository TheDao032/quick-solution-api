const taskTypeClass = require('../task-type/task-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListTaskType = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_delete'))
      .execute(PROCEDURE_NAME.CRM_TASKTYPE_GETLIST);

    const taskTypes = data.recordset;

    return new ServiceResponse(true, '', {
      'data': taskTypeClass.list(taskTypes),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(taskTypes),
    });
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.getListTaskType'});
    return new ServiceResponse(true, '', {});
  }
};

const detail = async (Id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TASKTYPEID', Id)
      .execute(PROCEDURE_NAME.CRM_TASKTYPE_GETBYID);
    let type = data.recordset;
    // If exists MD_AREA
    if (type && type.length>0) {
      type = taskTypeClass.detail(type[0]);
      return new ServiceResponse(true, '', type);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.detail'});
    return new ServiceResponse(false, e.message);
  }
};
// Create TaskType
const createTaskTypeOrUpdates = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    // create table tasktype
    const requestTaskTypeCreate = new sql.Request(transaction);
    const dataTaskTypeCreate = await requestTaskTypeCreate
      .input('TASKTYPEID', apiHelper.getValueFromObject(bodyParams, 'task_type_id'))
      .input('TYPENAME', apiHelper.getValueFromObject(bodyParams, 'task_type_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ADDFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'add_function_id'))
      .input('EDITFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'edit_function_id'))
      .input('DELETEFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'delete_function_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASKTYPE_CREATEORUPDATE);
    const taskTypeId = dataTaskTypeCreate.recordset[0].RESULT;
    if(taskTypeId <= 0)
    {
      return new ServiceResponse(false,RESPONSE_MSG.TASKTYPE.CREATE_FAILED);
    }
    // check update
    const id = apiHelper.getValueFromObject(bodyParams, 'task_type_id');
    if(id && id !== '')
    {
      // if update -> delete table CRM_TASKTYPE_WFOLLOW
      const requestTaskTypeWFollowCDelete = new sql.Request(transaction);
      const dataTaskTypeWFollowDelete = await requestTaskTypeWFollowCDelete
        .input('TASKTYPEID', id)
        .execute(PROCEDURE_NAME.CRM_TASKTYPE_WFOLLOW_DELETE);
      const resultDelete = dataTaskTypeWFollowDelete.recordset[0].RESULT;
      if(resultDelete <= 0)
      {
        return new ServiceResponse(false,RESPONSE_MSG.TASKTYPE.UPDATE_FAILED);
      }
    }
    // create table CRM_TASKTYPE_WFOLLOW
    const task_work_follow_list = apiHelper.getValueFromObject(bodyParams, 'task_work_follow_list');
    if(task_work_follow_list && task_work_follow_list.length > 0)
    {
      for(let i = 0;i < task_work_follow_list.length;i++) {
        const item = task_work_follow_list[i];
        const requestTaskTypeWFollowCreate = new sql.Request(transaction);
        const dataTaskTypeWFollowCreate = await requestTaskTypeWFollowCreate // eslint-disable-line no-await-in-loop
          .input('TASKWORKFOLLOWID', apiHelper.getValueFromObject(item, 'task_work_follow_id'))
          .input('ORDERINDEX', apiHelper.getValueFromObject(item, 'order_index'))
          .input('TASKTYPEID', taskTypeId)
          .execute(PROCEDURE_NAME.CRM_TASKTYPE_WFOLLOW_CREATE);
        const taskTypeWFollowId = dataTaskTypeWFollowCreate.recordset[0].RESULT;
        if(taskTypeWFollowId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.TASKTYPE.CREATE_FAILED);
        }
      }
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true,'',taskTypeId);
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.createTaskTypeOrUpdates'});
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

const changeStatusTaskType = async (taskTypeId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('TASKTYPEID', taskTypeId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASKTYPE_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.changeStatusTaskType'});

    return new ServiceResponse(false);
  }
};

const deleteTaskType = async (taskTypeId, bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    // check used 
    const requestTaskTypeCheckUsed = new sql.Request(transaction);
    const data = await requestTaskTypeCheckUsed
      .input('TASKTYPEID', taskTypeId)
      .execute(PROCEDURE_NAME.CRM_TASKTYPE_CHECKUSED);
    let used = taskTypeClass.detailUsed(data.recordset);
    if (used[0].result===1) { // used
      return new ServiceResponse(false, 'Task type used by '+used[0].table_used, null);
    }
    // remove table map CRM_TASKTYPE_WFOLLOW
    const requestTaskTypeWFollowDelete = new sql.Request(transaction);
    const dataTaskTypeWFollowDelete = await requestTaskTypeWFollowDelete
      .input('TASKTYPEID', taskTypeId)
      .execute(PROCEDURE_NAME.CRM_TASKTYPE_WFOLLOW_DELETE);
    const resultTaskTypeWFollowDelete = dataTaskTypeWFollowDelete.recordset[0].RESULT;
    if (resultTaskTypeWFollowDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.TASKTYPE.DELETE_FAILED);
    }
    // remove table TASKTYPE
    const requestTaskTypeDelete = new sql.Request(transaction);
    const dataTaskTypeDelete = await requestTaskTypeDelete
      .input('TASKTYPEID',taskTypeId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASKTYPE_DELETE);
    const resultTaskTypeDelete = dataTaskTypeDelete.recordset[0].RESULT;
    if (resultTaskTypeDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.TASKTYPE.DELETE_FAILED);
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true, RESPONSE_MSG.TASKTYPE.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.deleteTaskType'});
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};
const getFunctionsByUserGroupId = async function (queryParams) {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('USERGROUPID', apiHelper.getValueFromObject(queryParams, 'user_groups'))
      .execute(PROCEDURE_NAME.SYS_USER_GETPERMISSIONBYUSERGROUP);

    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.getFunctionsByUserGroupId'});
    return [];
  }
};
const getOptionsAll = async (typeFuctions,queryParams = {}) => {
  try {
    // Get parameter
    const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
    const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
    const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
    const isAdministrator = apiHelper.getValueFromObject(queryParams, 'isAdministrator');
    // Get data from cache
    const data = await cache.wrap(CACHE_CONST.CRM_TASKTYPE_OPTIONS, () => {
      return getOptions();
    });
    //get list functions of usergroupid
    const getDataFunctions = await getFunctionsByUserGroupId(queryParams);
    const dataFunctions = taskTypeClass.listFunctions(getDataFunctions);
    // Filter values: empty, null, undefined
    const idsFilter = ids.filter((item) => { return item; });
    const dataFilter = _.filter(data, (item) => {
      let isFilter = true;
      if(Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
        isFilter = false;
      }
      if(idsFilter.length && !idsFilter.includes(item.ID.toString())) {
        isFilter = false;
      }
      if(parentId && Number(parentId) !== item.PARENTID) {
        isFilter = false;
      }
      if(!dataFunctions || dataFunctions.length === 0)
      {
        isFilter = false;
      }
      if(isAdministrator !== 1)
      {
      // check quyền xem và xóa cho getoptions list
        if(typeFuctions && (typeFuctions.includes('EDITFUNCTIONID') || typeFuctions.includes('DELETEFUNCTIONID')))
        {
        // if check function edit or delete, nếu k có quyền thì k hiển thị item
          if(dataFunctions && dataFunctions.length && !dataFunctions.filter((vendor) => (vendor.function_id === item.EDITFUNCTIONID)).length > 0 && !dataFunctions.filter((vendor) => (vendor.function_id === item.DELETEFUNCTIONID)).length > 0)
          {
            isFilter = false;
          }
        }
        else if (typeFuctions && typeFuctions.includes('ADDFUNCTIONID'))
        {
          if(dataFunctions && dataFunctions.length && !dataFunctions.filter((vendor) => (vendor.function_id === item.ADDFUNCTIONID)).length>0)
          {
            isFilter = false;
          }
        }
      }

      if(isFilter) {
        item.ADD=false;
        item.EDIT=false;
        item.DELETE=false;
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.EDITFUNCTIONID)).length>0)
        {
          item.EDIT=true;
        }
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.DELETEFUNCTIONID)).length>0)
        {
          item.DELETE=true;
        }
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.ADDFUNCTIONID)).length>0)
        {
          item.ADD=true;
        }
        return item;
      }
      return null;
    });

    return new ServiceResponse(true, '', taskTypeClass.options(dataFilter));
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.getOptionsAll'});

    return new ServiceResponse(true, '', []);
  }
};
const getOptions = async function () {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('IsActive', API_CONST.ISACTIVE.ALL)
      .execute(PROCEDURE_NAME.CRM_TASKTYPE_GETOPTIONS);

    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.getOptions'});
    return [];
  }
};
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

module.exports = {
  getListTaskType,
  detail,
  createTaskTypeOrUpdates,
  changeStatusTaskType,
  deleteTaskType,
  getOptionsAll,
};
