const setupServiceRegisterClass = require('../setup-service-register/setup-service-register.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListAllSetupService = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_GETLISTALL_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': setupServiceRegisterClass.listSetupService(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'setupServiceRegisterService.getListAllSetupService'});
    return new ServiceResponse(true, '', {});
  }
};

const getListSetupServiceRegister = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('SETUPSERVICEID', apiHelper.getValueFromObject(queryParams, 'setup_service_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_REGISTER_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': setupServiceRegisterClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'setupServiceRegisterService.getListSetupServiceRegister'});
    return new ServiceResponse(true, '', {});
  }
};

const detailSetupServiceRegister = async (registerSetupId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('REGISTERSETUPID', registerSetupId)
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_REGISTER_GETBYID_ADMINWE);

    let registerSetup = data.recordset;
    // If exists news category
    if (registerSetup && registerSetup.length>0) {
      registerSetup = setupServiceRegisterClass.detail(registerSetup[0]);
      return new ServiceResponse(true, '', registerSetup);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'setupServiceRegisterService.detailSetupServiceRegister'});
    return new ServiceResponse(false, e.message);
  }
};

const deleteSetupServiceRegister = async (registerSetupId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('REGISTERSETUPID',registerSetupId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_REGISTER_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.SETUPSERVICEREGISTER.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'setupServiceRegisterService.deleteSetupServiceRegister'});
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListAllSetupService,
  getListSetupServiceRegister,
  detailSetupServiceRegister,
  deleteSetupServiceRegister,
};
