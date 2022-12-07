const contracTypeClass = require('../contract-type/contract-type.class');
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
const getListContractType = async (queryParams = {}) => {
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
      .input('CONTRACTTYPE', apiHelper.getFilterBoolean(queryParams, 'contract_type'))
      .execute(PROCEDURE_NAME.MD_CONTRACTTYPE_GETLIST);

    const contractTypes = data.recordset;

    return new ServiceResponse(true, '', {
      'data': contracTypeClass.list(contractTypes),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(contractTypes),
    });
  } catch (e) {
    logger.error(e, {'function': 'contractTypesService.getListContractType'});
    return new ServiceResponse(true, '', {});
  }
};

const detailContractType = async (contractTypeId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CONTRACTTYPEID', contractTypeId)
      .execute(PROCEDURE_NAME.MD_CONTRACTTYPE_GETBYID);

    let contractType = data.recordset;
    // If exists MD_AREA
    if (contractType && contractType.length>0) {
      contractType = contracTypeClass.detail(contractType[0]);
      return new ServiceResponse(true, '', contractType);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'contractTypeService.detailContractType'});
    return new ServiceResponse(false, e.message);
  }
};

const createContractTypeOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CONTRACTTYPEID', apiHelper.getValueFromObject(bodyParams, 'contract_type_id'))
      .input('CONTRACTTYPENAME', apiHelper.getValueFromObject(bodyParams, 'contract_type_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISCONTRACTPT', apiHelper.getValueFromObject(bodyParams, 'is_contract_pt'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_CONTRACTTYPE_CREATEORUPDATE);
    const contractTypeId = data.recordset[0].RESULT;
    removeCacheOptions();
    return new ServiceResponse(true,'',contractTypeId);
  } catch (e) {
    logger.error(e, {'function': 'contractTypeService.createContractTypeOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusContractType = async (contractTypeId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('CONTRACTTYPEID', contractTypeId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_CONTRACTTYPE_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'contractTypeService.changeStatusContractType'});

    return new ServiceResponse(false);
  }
};

const deleteContractType = async (contractTypeId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('CONTRACTTYPEID',contractTypeId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_CONTRACTTYPE_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.CONTRACTTYPE.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'contractTypeService.deleteContractType'});
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_CONTRACTTYPE_OPTIONS);
};

module.exports = {
  getListContractType,
  detailContractType,
  createContractTypeOrUpdate,
  changeStatusContractType,
  deleteContractType,
};
