const candidateClass = require('../candidate/candidate.class');
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
const getListCandidate = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('POSITIONID', apiHelper.getValueFromObject(queryParams, 'position_id'))
      .input('STATUS', apiHelper.getValueFromObject(queryParams, 'status'))
      .execute(PROCEDURE_NAME.HR_CANDIDATE_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': candidateClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'candidateService.getListCandidate'});
    return new ServiceResponse(true, '', {});
  }
};

const getListAttachment = async (candidateId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CANDIDATEID', candidateId)
      .execute(PROCEDURE_NAME.HR_CANDIDATE_ATTACHMENT_GETLIST_ADMINWEB);

    const stores = data.recordset;
    return new ServiceResponse(true, '', {
      'data': candidateClass.listAttachment(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'candidateService.getListAttachment'});
    return new ServiceResponse(true, '', {});
  }
};

const detailCandidate = async (candidateId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CANDIDATEID', candidateId)
      .execute(PROCEDURE_NAME.HR_CANDIDATE_GETBYID_ADMINWEB);

    let candidate = data.recordset;
    if (candidate && candidate.length>0) {
      candidate = candidateClass.detail(candidate[0]);
      return new ServiceResponse(true, '', candidate);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'candidateService.detailCandidate'});
    return new ServiceResponse(false, e.message);
  }
};

const createCandidateOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('CANDIDATEID', apiHelper.getValueFromObject(bodyParams, 'candidate_id'))
      .input('STATUS', apiHelper.getValueFromObject(bodyParams, 'status'))
      .input('HRDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'hr_description'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_CANDIDATE_CREATEORUPDATE_ADMINWEB);
    const newsCategoryId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',newsCategoryId);
  } catch (e) {
    logger.error(e, {'function': 'candidateService.createNewsCategoryOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusCandidate = async (candidateId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('CANDIDATEID', candidateId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_CANDIDATE_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'candidateService.changeStatusNewsCategory'});
    return new ServiceResponse(false);
  }
};

const deleteCandidate = async (candidateId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('CANDIDATEID',candidateId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_CANDIDATE_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.CANDIDATE.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'candidateService.deleteNewsCategory'});
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListCandidate,
  detailCandidate,
  createCandidateOrUpdate,
  deleteCandidate,
  changeStatusCandidate,
  getListAttachment,
};
