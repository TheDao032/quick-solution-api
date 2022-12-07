const membershipClass = require('../membership/membership.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListMembership = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
      .input('AGEFROM', apiHelper.getValueFromObject(queryParams, 'age_from'))
      .input('AGETO', apiHelper.getValueFromObject(queryParams, 'age_to'))
      .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
      .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
      .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_MEMBERSHIPS_GETLIST);

    const dataRecord = data.recordset;

    return new ServiceResponse(true, '', {
      'data': membershipClass.list(dataRecord),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(dataRecord),
    });
  } catch (e) {
    logger.error(e, {'function': 'MembershipService.getListMembership'});
    return new ServiceResponse(false, e.message);
  }
};


const detailMembership = async (membership_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('MEMBERSHIPID', membership_id)
      .execute(PROCEDURE_NAME.CRM_MEMBERSHIPS_GETBYID);
    if (data.recordset && data.recordset.length > 0) {
      const record = membershipClass.detail(data.recordset[0]);
      return new ServiceResponse(true, '', record);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'MembershipService.detailMembership' });

    return new ServiceResponse(false, e.message);
  }
};
const detailAccount = async (member_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('MEMBERID', member_id)
      .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETBYID);
    if (data.recordset && data.recordset.length > 0) {
      const record = membershipClass.detailAccount(data.recordset[0]);
      return new ServiceResponse(true, '', record);
    }
    return new ServiceResponse(true, '', null);
  } catch (e) {
    logger.error(e, { 'function': 'MembershipService.detailAccount' });

    return new ServiceResponse(false, e.message);
  }
};
const listContract = async (member_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('MEMBERID', member_id)
      .execute(PROCEDURE_NAME.CT_CONTRACT_GETLISTBYMEMBERID);
    if (data.recordset && data.recordset.length > 0) {
      const record = membershipClass.listContract(data.recordset);
      return new ServiceResponse(true, '', record);
    }
    return new ServiceResponse(true, '', null);
  } catch (e) {
    logger.error(e, { 'function': 'MembershipService.listContract' });

    return new ServiceResponse(false, e.message);
  }
};
const listHistory = async (member_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('MEMBERID', member_id)
      .execute(PROCEDURE_NAME.CRM_HISTORY_MEMBERSHIPS_GETLISTBYMEMBERID);
    if (data.recordset && data.recordset.length > 0) {
      const record = membershipClass.listHistory(data.recordset);
      return new ServiceResponse(true, '', record);
    }
    return new ServiceResponse(true, '', null);
  } catch (e) {
    logger.error(e, { 'function': 'MembershipService.listHistory' });

    return new ServiceResponse(false, e.message);
  }
};

const changeStatusMembership = async (membership_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('MEMBERSHIPID', membership_id)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_MEMBERSHIPS_UPDATESTATUS);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'MembershipService.changeStatusMembership'});
    return new ServiceResponse(false);
  }
};

const deleteMembership = async (membership_id, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('MEMBERSHIPID', membership_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_MEMBERSHIPS_DELETE);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'MembershipService.deleteMembership'});
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListMembership,
  detailMembership,
  deleteMembership,
  changeStatusMembership,
  detailAccount,
  listContract,
  listHistory,
};
