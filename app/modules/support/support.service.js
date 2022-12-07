const supportClass = require('../support/support.class');
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
const getListSupport = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('TOPICID', apiHelper.getValueFromObject(queryParams, 'topic_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CMS_SUPPORT_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': supportClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'supportService.getListSupport'});
    return new ServiceResponse(true, '', {});
  }
};

const getListAllSupport = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute(PROCEDURE_NAME.CMS_SUPPORT_GETLISTALL_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': supportClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'supportService.getListAllSupport'});
    return new ServiceResponse(true, '', {});
  }
};

const detailSupport = async (supportId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('SUPPORTID', supportId)
      .execute(PROCEDURE_NAME.CMS_SUPPORT_GETBYID_ADMINWEB);

    let support = data.recordset;

    if (support && support.length>0) {
      support = supportClass.detail(support[0]);
      return new ServiceResponse(true, '', support);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'supportService.detailSupport'});
    return new ServiceResponse(false, e.message);
  }
};

const deleteSupport = async (supportId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('SUPPORTID',supportId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_SUPPORT_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.SUPPORT.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'supportService.deleteSupport'});
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusSupport = async (supportId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('SUPPORTID', supportId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_SUPPORT_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'supportService.changeStatusSupport'});
    return new ServiceResponse(false);
  }
};

module.exports = {
  getListSupport,
  detailSupport,
  deleteSupport,
  getListAllSupport,
  changeStatusSupport,
};
