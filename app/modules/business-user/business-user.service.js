const businessUserClass = require('../business-user/business-user.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getList = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .execute(PROCEDURE_NAME.SYS_BUSINESS_USER_GETLIST);

    const listResult = data.recordset;

    return new ServiceResponse(true, '', {
      'data': businessUserClass.list(listResult),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(listResult),
    });
  } catch (e) {
    logger.error(e, {'function': 'businessUserService.getList'});
    return new ServiceResponse(true, '', {});
  }
};

const detail = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('USERID', apiHelper.getValueFromObject(bodyParams, 'user_id'))
      .execute(PROCEDURE_NAME.SYS_BUSINESS_USER_GETBYID);

    let result = data.recordset;
    // If exists MD_AREA
    if (result && result.length>0) {
      result = businessUserClass.detail(result[0]);
      return new ServiceResponse(true, '', result);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'businessUserService.detail'});
    return new ServiceResponse(false, e.message);
  }
};

const create = async (bodyParams) => {
  try {
    const user_list = apiHelper.getValueFromObject(bodyParams, 'user_list').join('|');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('USERIDS',user_list)
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SYS_BUSINESS_USER_CREATEORUPDATE);
    const businessId = data.recordset[0].RESULT;
    return new ServiceResponse(true,'',businessId);
  } catch (e) {
    logger.error(e, {'function': 'businessUserService.create'});
    return new ServiceResponse(false);
  }
};


const deleteBU = async (bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('USERID', apiHelper.getValueFromObject(bodyParams, 'user_id'))
      .execute(PROCEDURE_NAME.SYS_BUSINESS_USER_DELETE);
    return new ServiceResponse(true, RESPONSE_MSG.BUSINESSUSER.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'businessUserService.deleteBU'});
    return new ServiceResponse(false, e.message);
  }
};


module.exports = {
  getList,
  detail,
  create,
  deleteBU,
};
