const recruitClass = require('../recruit/recruit.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list HR_RECRUIT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListRecruit = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('POSITIONID', apiHelper.getValueFromObject(queryParams, 'position_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.HR_RECRUIT_GETLIST_ADMINWEB);

    const recruit = data.recordset;

    return new ServiceResponse(true, '', {
      'data': recruitClass.list(recruit),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(recruit),
    });
  } catch (e) {
    logger.error(e, {'function': 'recruitService.getListRecruit'});
    return new ServiceResponse(true, '', {});
  }
};

const detailRecruit = async (recruitId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('RECRUITID', recruitId)
      .execute(PROCEDURE_NAME.HR_RECRUIT_GETBYID_ADMINWEB);

    let recruit = data.recordset;
    // If exists SYS_USERGROUP
    if (recruit && recruit.length>0) {
      recruit = recruitClass.detail(recruit[0]);
      return new ServiceResponse(true, '', recruit);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'recruitService.detailRecruit'});
    return new ServiceResponse(false, e.message);
  }
};

const createRecruitOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('RECRUITID', apiHelper.getValueFromObject(bodyParams, 'recruit_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('RECRUITTITLE', apiHelper.getValueFromObject(bodyParams, 'recruit_title'))
      .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
      .input('QUANTITY', apiHelper.getValueFromObject(bodyParams, 'quantity'))
      .input('SALARYFROM', apiHelper.getValueFromObject(bodyParams, 'salary_from'))
      .input('SALARYTO', apiHelper.getValueFromObject(bodyParams, 'salary_to'))
      .input('RECRUITCONTENT', apiHelper.getValueFromObject(bodyParams, 'recruit_content'))
      .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
      .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_keywords'))
      .input('METADESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'meta_descriptions'))
      .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
      .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_RECRUIT_CREATEORUPDATE_ADMINWEB);
    const recruitId = data.recordset[0].RESULT;
    removeCacheOptions();
    return new ServiceResponse(true,'',recruitId);
  } catch (e) {
    logger.error(e, {'function': 'recruitService.createRecruitOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusRecruit = async (recruitId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('RECRUITID', recruitId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_RECRUIT_UPDATESTATUS_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'recruitService.changeStatusRecruit'});

    return new ServiceResponse(false);
  }
};

const deleteRecruit = async (recruitId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('RECRUITID',recruitId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_RECRUIT_DELETE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.RECRUIT.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'recruitService.deleteRecruit'});
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.HR_RECRUIT_OPTIONS);
};

module.exports = {
  getListRecruit,
  detailRecruit,
  createRecruitOrUpdate,
  changeStatusRecruit,
  deleteRecruit,
};
