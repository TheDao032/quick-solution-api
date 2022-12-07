const newsStatusClass = require('../news-status/news-status.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListNewsStatus = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': newsStatusClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'newsStatusService.getListNewsStatus'});
    return new ServiceResponse(true, '', {});
  }
};

const getListAllNewsStatus = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_GETLISTALL_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': newsStatusClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'newsStatusService.getListAllNewsStatus'});
    return new ServiceResponse(true, '', {});
  }
};

const detailNewsStatus = async (newsStatusId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('NEWSSTATUSID', newsStatusId)
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_GETBYID_ADMINWEB);

    let newsStatus = data.recordset;
    // If exists news category
    if (newsStatus && newsStatus.length>0) {
      newsStatus = newsStatusClass.detail(newsStatus[0]);
      return new ServiceResponse(true, '', newsStatus);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'newsStatusService.detailNewsStatus'});
    return new ServiceResponse(false, e.message);
  }
};
const createNewsStatusOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    //check name
    const dataCheck = await pool.request()
      .input('NEWSSTATUSID', apiHelper.getValueFromObject(bodyParams, 'news_status_id'))
      .input('NEWSSTATUSNAME', apiHelper.getValueFromObject(bodyParams, 'news_status_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_CHECKNAME_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWSSTATUS.EXISTS_NAME, null);
    }
    //check orderindex
    const dataCheckOrderIndex = await pool.request()
      .input('NEWSSTATUSID', apiHelper.getValueFromObject(bodyParams, 'news_status_id'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_CHECKORDERINDEX_ADMINWEB);
    if (!dataCheckOrderIndex.recordset || !dataCheckOrderIndex.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWSSTATUS.EXISTS_ORDERINDEX, null);
    }
    const data = await pool.request()
      .input('NEWSSTATUSID', apiHelper.getValueFromObject(bodyParams, 'news_status_id'))
      .input('NEWSSTATUSNAME', apiHelper.getValueFromObject(bodyParams, 'news_status_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_CREATEORUPDATE_ADMINWEB);
    const newsStatusId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',newsStatusId);
  } catch (e) {
    logger.error(e, {'function': 'newsStatusService.createNewsStatusOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusNewsStatus = async (newsStatusId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('NEWSSTATUSID', newsStatusId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'newsStatusService.changeStatusNewsStatus'});
    return new ServiceResponse(false);
  }
};

const deleteNewsStatus = async (newsStatusId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('NEWSSTATUSID',newsStatusId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.NEWSSTATUS.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'newsStatusService.deleteNewsStatus'});
    return new ServiceResponse(false, e.message);
  }
};

const checkOrderIndexNewsStatus = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('NEWSSTATUSID', apiHelper.getValueFromObject(bodyParams, 'news_status_id'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .execute(PROCEDURE_NAME.NEWS_NEWSSTATUS_CHECKORDERINDEX_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWSSTATUS.EXISTS_ORDERINDEX, null);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'newsStatusService.checkOrderIndexNewsStatus'});
    return new ServiceResponse(false);
  }
};

module.exports = {
  getListNewsStatus,
  detailNewsStatus,
  createNewsStatusOrUpdate,
  deleteNewsStatus,
  changeStatusNewsStatus,
  getListAllNewsStatus,
  checkOrderIndexNewsStatus,
};
