const segmentClass = require('../segment/segment.class');
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
const getListSegment = async (queryParams = {}) => {
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
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_delete'))
      .execute(PROCEDURE_NAME.CRM_SEGMENT_GETLIST);

    const segment = data.recordset;

    return new ServiceResponse(true, '', {
      'data': segmentClass.list(segment),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(segment),
    });
  } catch (e) {
    logger.error(e, {'function': 'segmentService.getListSegment'});
    return new ServiceResponse(true, '', {});
  }
};

const detailSegment = async (segmentId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('SEGMENTID', segmentId)
      .execute(PROCEDURE_NAME.CRM_SEGMENT_GETBYID);

    let segment = data.recordset;
    // If exists SYS_USERGROUP
    if (segment && segment.length>0) {
      segment = segmentClass.detail(segment[0]);
      return new ServiceResponse(true, '', segment);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'segmentService.detailSegment'});
    return new ServiceResponse(false, e.message);
  }
};

const createSegmentOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const dataCheck = await pool.request()
      .input('SEGMENTID', apiHelper.getValueFromObject(bodyParams, 'segment_id'))
      .input('SEGMENTNAME', apiHelper.getValueFromObject(bodyParams, 'segment_name'))
      .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
      .execute(PROCEDURE_NAME.CRM_SEGMENT_CHECKNAME);

    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) { // used
      return new ServiceResponse(false, RESPONSE_MSG.SEGMENT.CHECK_NAME_FAILED, null);
    }
    const data = await pool.request()
      .input('SEGMENTID', apiHelper.getValueFromObject(bodyParams, 'segment_id'))
      .input('SEGMENTNAME', apiHelper.getValueFromObject(bodyParams, 'segment_name'))
      .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_SEGMENT_CREATEORUPDATE);
    const segmentId = data.recordset[0].RESULT;
    removeCacheOptions();
    return new ServiceResponse(true,'',segmentId);
  } catch (e) {
    logger.error(e, {'function': 'segmentService.createSegmentOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusSegment = async (segmentId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('SEGMENTID', segmentId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_SEGMENT_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'segmentService.changeStatusSegment'});

    return new ServiceResponse(false);
  }
};

const deleteSegment = async (segmentId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('SEGMENTID', segmentId)
      .execute(PROCEDURE_NAME.CRM_SEGMENT_CHECKUSED);

    let used = segmentClass.detailUsed(data.recordset);
    if (used[0].result===1) { // used
      return new ServiceResponse(false, 'Segment used by '+used[0].table_used, null);
    }

    await pool.request()
      .input('SEGMENTID',segmentId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_SEGMENT_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.SEGMENT.AM_COMPANY_DELETE);
  } catch (e) {
    logger.error(e, {'function': 'segmentService.deleteSegment'});
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_SEGMENT_OPTIONS);
};

module.exports = {
  getListSegment,
  detailSegment,
  createSegmentOrUpdate,
  changeStatusSegment,
  deleteSegment,
};
