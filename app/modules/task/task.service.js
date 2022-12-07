const taskClass = require('../task/task.class');
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
const getListTask = async (auth_name,queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('STARTDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date_from'))
      .input('STARTDATETO', apiHelper.getValueFromObject(queryParams, 'start_date_to'))
      .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id'))
      .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
      .input('ENDDATEFROM', apiHelper.getValueFromObject(queryParams, 'end_date_from'))
      .input('ENDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('ISCOMPLETED', apiHelper.getFilterBoolean(queryParams, 'is_completed'))
      .input('USERNAME', auth_name)
      .execute(PROCEDURE_NAME.CRM_TASK_GETLIST);

    const tasks = data.recordset;

    return new ServiceResponse(true, '', {
      'data': taskClass.list(tasks),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(tasks),
    });
  } catch (e) {
    logger.error(e, {'function': 'taskService.getListTask'});
    return new ServiceResponse(true, '', {});
  }
};
const detail = async (Id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TASKID', Id)
      .execute(PROCEDURE_NAME.CRM_TASK_GETBYID);
    let task = data.recordset;
    // If exists MD_AREA
    if (task && task.length>0) {
      task = taskClass.detail(task[0]);
      return new ServiceResponse(true, '', task);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'taskService.detail'});
    return new ServiceResponse(false, e.message);
  }
};
// Create TaskType
const createTaskOrUpdates = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    // create table tasktype
    const requestTaskCreate = new sql.Request(transaction);
    const dataTaskCreate = await requestTaskCreate
      .input('TASKID', apiHelper.getValueFromObject(bodyParams, 'task_id'))
      .input('TASKTYPEID', apiHelper.getValueFromObject(bodyParams, 'task_type_id'))
      .input('TASKSTATUSID', apiHelper.getValueFromObject(bodyParams, 'task_status_id'))
      .input('TASKNAME', apiHelper.getValueFromObject(bodyParams, 'task_name'))
      .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
      .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
      .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASK_CREATEORUPDATE);
    const taskId = dataTaskCreate.recordset[0].RESULT;
    if(taskId <= 0)
    {
      return new ServiceResponse(false,RESPONSE_MSG.TASK.CREATE_FAILED);
    }
    // check update
    const id = apiHelper.getValueFromObject(bodyParams, 'task_id');
    if(id && id !== '')
    {
      // if update -> delete table CRM_TASKTYPE_WFOLLOW
      const requestTaskDataleadsDelete = new sql.Request(transaction);
      const dataTaskDataleadsDelete = await requestTaskDataleadsDelete
        .input('TASKID', id)
        .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_DELETE);
      const resultDelete = dataTaskDataleadsDelete.recordset[0].RESULT;
      if(resultDelete <= 0)
      {
        return new ServiceResponse(false,RESPONSE_MSG.TASK.UPDATE_FAILED);
      }
    }
    // create table CRM_TASKTYPE_WFOLLOW
    const list_task_dataleads = apiHelper.getValueFromObject(bodyParams, 'list_task_dataleads');
    if(list_task_dataleads && list_task_dataleads.length > 0)
    {
      for(let i = 0;i < list_task_dataleads.length;i++) {
        const item = list_task_dataleads[i];
        const requestTaskDataleadsCreate = new sql.Request(transaction);
        const dataTaskDataleadsCreate = await requestTaskDataleadsCreate // eslint-disable-line no-await-in-loop
          .input('DATALEADSID', apiHelper.getValueFromObject(item, 'dataleads_id'))
          .input('TASKID', taskId)
          .input('TASKTYPEID', apiHelper.getValueFromObject(bodyParams, 'task_type_id'))
          .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
          .input('USERNAME', apiHelper.getValueFromObject(item, 'user_name'))
          .input('SUPERVISORNAME', apiHelper.getValueFromObject(item, 'supervisor_name'))
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_CREATE);
        const taskDataleadsId = dataTaskDataleadsCreate.recordset[0].RESULT;
        if(taskDataleadsId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.TASK.CREATE_FAILED);
        }
      }
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true,'',taskId);
  } catch (e) {
    logger.error(e, {'function': 'taskService.createTaskOrUpdates'});
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

const changeStatusTask= async (taskId, bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestTaskDataleadsUpdate = new sql.Request(transaction);
    const dataTaskDataleadUpdate = await requestTaskDataleadsUpdate
      .input('TASKID', taskId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_UPDATESTATUS);
    const resultTaskDataleadsUpdate = dataTaskDataleadUpdate.recordset[0].RESULT;
    if (resultTaskDataleadsUpdate <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.TASK.UPDATE_FAILED);
    }
    const requestTaskUpdate = new sql.Request(transaction);
    await requestTaskUpdate
      .input('TASKID', taskId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASK_UPDATESTATUS);
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'taskService.changeStatusTask'});
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

const deleteTask = async (taskId, bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    // check used 
    const requestTaskCheckUsed = new sql.Request(transaction);
    const data = await requestTaskCheckUsed
      .input('TASKID', taskId)
      .execute(PROCEDURE_NAME.CRM_TASK_CHECKUSED);
    let used = taskClass.detailUsed(data.recordset);
    if (used[0].result===1) { // used
      return new ServiceResponse(false, 'Task used by '+used[0].table_used, null);
    }
    // remove table map CRM_TASKTYPE_WFOLLOW
    const requestTaskDataleadsDelete = new sql.Request(transaction);
    const dataTaskDataleadDelete = await requestTaskDataleadsDelete
      .input('TASKID', taskId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_DELETE);
    const resultTaskDataleadsDelete = dataTaskDataleadDelete.recordset[0].RESULT;
    if (resultTaskDataleadsDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.TASK.DELETE_FAILED);
    }
    // remove table TASKTYPE
    const requestTaskDelete = new sql.Request(transaction);
    const dataTaskDelete = await requestTaskDelete
      .input('TASKID',taskId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASK_DELETE);
    const resultTaskDelete = dataTaskDelete.recordset[0].RESULT;
    if (resultTaskDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.TASK.DELETE_FAILED);
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true, RESPONSE_MSG.TASK.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'taskService.deleteTask'});
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

module.exports = {
  getListTask,
  detail,
  createTaskOrUpdates,
  changeStatusTask,
  deleteTask,
};
