const taskWorkFollowClass = require('../task-work-follow/task-work-follow.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');

const getListTaskWFollowByType = async (taskTypeId) => {
  try {

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TASKTYPEID', taskTypeId)
      .execute(PROCEDURE_NAME.CRM_TASKWORKFOLLOW_GETBYTYPE);

    const datas = data.recordset;

    return new ServiceResponse(true, '',taskWorkFollowClass.listByType(datas));
  } catch (e) {
    logger.error(e, {'function': 'taskTypeService.getListTaskType'});
    return new ServiceResponse(true, '', {});
  }
};

const detailTaskWorkFollow = async (taskWorkFollowId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TASKWORKFOLLOWID', taskWorkFollowId)
      .execute(PROCEDURE_NAME.CRM_TASKWORKFOLLOW_GETBYID);

    let taskWorkFollow = data.recordset;
    // If exists MD_AREA
    if (taskWorkFollow && taskWorkFollow.length>0) {
      taskWorkFollow = taskWorkFollowClass.detail(taskWorkFollow[0]);
      return new ServiceResponse(true, '', taskWorkFollow);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'taskWorkFollowService.detailTaskWorkFollow'});
    return new ServiceResponse(false, e.message);
  }
};

const createOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TASKWORKFOLLOWID', apiHelper.getValueFromObject(bodyParams, 'task_work_follow_id'))
      .input('WORKFOLLOWNAME', apiHelper.getValueFromObject(bodyParams, 'task_work_follow_name'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISCOMPLETE', apiHelper.getValueFromObject(bodyParams, 'is_complete'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASKWORKFOLLOW_CREATEORUPDATE);
    const Id = data.recordset[0].RESULT;
    removeCacheOptions();
    return new ServiceResponse(true,'',Id);
  } catch (e) {
    logger.error(e, {'function': 'taskWorkFollowService.createOrUpdate'});
    return new ServiceResponse(false);
  }
};

/**
 * Get options
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getOptions = async function () {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('IsActive', API_CONST.ISACTIVE.ALL)
      .execute(PROCEDURE_NAME.CRM_TASKWORKFOLLOW_GETOPTIONS);
    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'taskWorkFollowService.getOptions'});
    return [];
  }
};


const getOptionsAll = async (queryParams = {}) => {
  try {
    // Get parameter
    const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
    const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
    const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
    // Get data from cache
    const data = await cache.wrap(CACHE_CONST.CRM_TASKWORKFOLLOW_OPTIONS, () => {
      return getOptions();
    });
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
      if(isFilter) {
        return item;
      }
      return null;
    });

    return new ServiceResponse(true, '', taskWorkFollowClass.options(dataFilter));
  } catch (e) {
    logger.error(e, {'function': 'taskWorkFollowService.getOptionsAll'});

    return new ServiceResponse(true, '', []);
  }
};


const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKWORKFOLLOW_OPTIONS);
};

module.exports = {
  detailTaskWorkFollow,
  createOrUpdate,
  getOptionsAll,
  getListTaskWFollowByType,
};
