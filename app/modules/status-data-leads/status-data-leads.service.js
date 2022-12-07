const statusDataLeadsClass = require('../status-data-leads/status-data-leads.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const _ = require('lodash');
const API_CONST = require('../../common/const/api.const');
/**
 * Get list AM_COMPANY
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListStatusDataLeads = async (queryParams = {}) => {
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
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_deleted'))
      .execute(PROCEDURE_NAME.CRM_STATUSDATALEADS_GETLIST);

    const StatusDataLeads = data.recordset;

    return new ServiceResponse(true, '', {
      'data': statusDataLeadsClass.list(StatusDataLeads),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(StatusDataLeads),
    });
  } catch (e) {
    logger.error(e, {'function': 'StatusDataLeadsService.getListStatusDataLeads'});
    return new ServiceResponse(true, '', {});
  }
};

const detailStatusDataLeads = async (StatusDataLeadsId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('STATUSDATALEADSID', StatusDataLeadsId)
      .execute(PROCEDURE_NAME.CRM_STATUSDATALEADS_GETBYID);

    let StatusDataLeads = data.recordset;
    // If exists
    if (StatusDataLeads && StatusDataLeads.length>0) {
      StatusDataLeads = statusDataLeadsClass.detail(StatusDataLeads[0]);
      return new ServiceResponse(true, '', StatusDataLeads);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'StatusDataLeadsService.detailStatusDataLeads'});

    return new ServiceResponse(false, e.message);
  }
};

const createStatusDataLeadsOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('STATUSDATALEADSID', apiHelper.getValueFromObject(bodyParams, 'status_data_leads_id'))
      .input('STATUSNAME', apiHelper.getValueFromObject(bodyParams, 'status_name'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('ISWON', apiHelper.getValueFromObject(bodyParams, 'is_won'))
      .input('ISLOST', apiHelper.getValueFromObject(bodyParams, 'is_lost'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_STATUSDATALEADS_CREATEORUPDATE);
    const StatusDataLeadsId = data.recordset[0].RESULT;
    removeCacheOptions();
    return new ServiceResponse(true,'',StatusDataLeadsId);
  } catch (e) {
    logger.error(e, {'function': 'StatusDataLeadsService.createStatusDataLeadsOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusStatusDataLeads = async (StatusDataLeadsId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('STATUSDATALEADSID', StatusDataLeadsId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_STATUSDATALEADS_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'StatusDataLeadsService.changeStatusStatusDataLeads'});

    return new ServiceResponse(false);
  }
};

const deleteStatusDataLeads = async (StatusDataLeadsId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('STATUSDATALEADSID',StatusDataLeadsId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_STATUSDATALEADS_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'StatusDataLeadsService.deleteStatusDataLeads'});
    return new ServiceResponse(false, e.message);
  }
};
const getOptionsDb = async function () {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('IsActive', API_CONST.ISACTIVE.ALL)
      .execute(PROCEDURE_NAME.CRM_STATUSDATALEADS_GETOPTIONS);
    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'StatusDataLeadsService.getOptions'});
    return [];
  }
};

const getOptions = async function (queryParams) {
  try {
    // Get parameter
    const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
    const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active')||2;
    const isLost = apiHelper.getValueFromObject(queryParams, 'is_lost')||2;
    const isWon = apiHelper.getValueFromObject(queryParams, 'is_won')||2;
    const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
    // Get data from cache
    const data = await cache.wrap(CACHE_CONST.CRM_STATUSDATALEADS_OPTIONS, () => {
      return getOptionsDb();
    });

    // Filter values: empty, null, undefined
    const idsFilter = ids.filter((item) => { return item; });
    const dataFilter = _.filter(data, (item) => {
      let isFilter = true;
      if(Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
        isFilter = false;
      }
      if(Number(isLost) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isLost)) !== item.ISLOST) {
        isFilter = false;
      }
      if(Number(isWon) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isWon)) !== item.ISWON) {
        isFilter = false;
      }
      if(idsFilter.length && !idsFilter.includes(item.ID.toString())) {
        isFilter = false;
      }
      if(parentId && Number(parentId) !== Number(item.PARENTID)) {
        isFilter = false;
      }
      if(isFilter) {
        return item;
      }

      return null;
    });

    return new ServiceResponse(true, '', statusDataLeadsClass.options(dataFilter));
  } catch (e) {
    logger.error(e, {'function': 'StatusDataLeadsService.getOptions'});

    return new ServiceResponse(true, '', []);
  }
};
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_STATUSDATALEADS_OPTIONS);
};

module.exports = {
  getListStatusDataLeads,
  detailStatusDataLeads,
  createStatusDataLeadsOrUpdate,
  changeStatusStatusDataLeads,
  deleteStatusDataLeads,
  getOptions,
};
