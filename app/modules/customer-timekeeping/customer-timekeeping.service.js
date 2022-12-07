const cusTimeClass = require('../customer-timekeeping/customer-timekeeping.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
/**
 * Get list AM_BUSINESS
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
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('STARTDATEFROM', apiHelper.getValueFromObject(queryParams, 'timekeeping_from'))
      .input('STARTDATETO', apiHelper.getValueFromObject(queryParams, 'timekeeping_to'))
      .input('ISCOMPLETETRAINPT', apiHelper.getFilterBoolean(queryParams, 'is_complete_trainpt'))
      .execute(PROCEDURE_NAME.HR_CUSTOMER_TIMEKEEPING_GETLIST);

    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      'data': cusTimeClass.list(datas),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { 'function': 'cusTimeService.getList' });

    return new ServiceResponse(true, '', {});
  }
};
module.exports = {
  getList,
};
