const campaignStatusClass = require('../campaign-status/campaign-status.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list AM_COMPANY
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCampaignStatus = async (queryParams = {}) => {
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
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNSTATUS_GETLIST);

    const campaignStatus = data.recordset;

    return new ServiceResponse(true, '', {
      'data': campaignStatusClass.list(campaignStatus),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(campaignStatus),
    });
  } catch (e) {
    logger.error(e, {'function': 'campaignStatusService.getListCampaignStatus'});
    return new ServiceResponse(true, '', {});
  }
};

const detailCampaignStatus = async (campaignStatusId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CAMPAIGNSTATUSID', campaignStatusId)
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNSTATUS_GETBYID);

    let campaignStatus = data.recordset;
    // If exists SYS_USERGROUP
    if (campaignStatus && campaignStatus.length>0) {
      campaignStatus = campaignStatusClass.detail(campaignStatus[0]);
      return new ServiceResponse(true, '', campaignStatus);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'campaignStatusService.detailCampaignStatus'});

    return new ServiceResponse(false, e.message);
  }
};

const createCampaignStatusOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const datacheck =await pool.request()
      .input('CAMPAIGNSTATUSID', apiHelper.getValueFromObject(bodyParams, 'campaign_status_id'))
      .input('CAMPAIGNSTATUSNAME', apiHelper.getValueFromObject(bodyParams, 'campaign_status_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNSTATUS_CHECKNAME);
    if(datacheck.recordset[0].RESULT <=0) {
      return new ServiceResponse(false,RESPONSE_MSG.CAMPAIGNSTATUS.CHECK_NAME_FAILED);
    }
    const data = await pool.request()
      .input('CAMPAIGNSTATUSID', apiHelper.getValueFromObject(bodyParams, 'campaign_status_id'))
      .input('CAMPAIGNSTATUSNAME', apiHelper.getValueFromObject(bodyParams, 'campaign_status_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNSTATUS_CREATEORUPDATE);
    const campaignStatusId = data.recordset[0].RESULT;
    removeCacheOptions();
    return new ServiceResponse(true,'',campaignStatusId);
  } catch (e) {
    logger.error(e, {'function': 'campaignStatusService.createCampaignStatusOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusCampaignStatus = async (campaignStatusId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('CAMPAIGNSTATUSID', campaignStatusId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNSTATUS_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'campaignStatusService.changeStatusCampaignStatus'});

    return new ServiceResponse(false);
  }
};

const deleteCampaignStatus = async (campaignStatusId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CAMPAIGNSTATUSID', campaignStatusId)
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNSTATUS_CHECKUSED);

    let used = campaignStatusClass.detailUsed(data.recordset);
    if (used[0].result===1) { // used
      return new ServiceResponse(false, 'campaign status used by '+used[0].table_used, null);
    }

    await pool.request()
      .input('CAMPAIGNSTATUSID',campaignStatusId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNSTATUS_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.CAMPAIGNSTATUS.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'campaignStatusService.deleteCampaignStatus'});
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_CAMPAIGNSTATUS_OPTIONS);
};

module.exports = {
  getListCampaignStatus,
  detailCampaignStatus,
  createCampaignStatusOrUpdate,
  changeStatusCampaignStatus,
  deleteCampaignStatus,
};
