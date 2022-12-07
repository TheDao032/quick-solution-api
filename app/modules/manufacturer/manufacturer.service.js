const manufacturerClass = require('../manufacturer/manufacturer.class');
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
const getListManufacturer = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('ISDELETED', apiHelper.getValueFromObject(queryParams, 'is_deleted'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_MANUFACTURER_GETLIST);

    const dataRecord = data.recordset;

    return new ServiceResponse(true, '', {
      'data': manufacturerClass.list(dataRecord),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(dataRecord),
    });
  } catch (e) {
    logger.error(e, {'function': 'ManufacturerService.getListManufacturer'});
    return new ServiceResponse(false, e.message);
  }
};

const createManufacturerOrUpdate = async (body={}) => {
  const pool = await mssql.pool;
  try {
    const dataCheck = await pool.request()
      .input('MANUFACTURERID', apiHelper.getValueFromObject(body, 'manufacturer_id'))
      .input('MANUFACTURERNAME', apiHelper.getValueFromObject(body, 'manufacturer_name'))
      .execute(PROCEDURE_NAME.MD_MANUFACTURER_CHECKNAME);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) { // used
      return new ServiceResponse(false, RESPONSE_MSG.MANUFACTURER.CHECK_NAME_FAILED, null);
    }
    // Save Manufacturer
    const result = await pool.request()
      .input('MANUFACTURERID', apiHelper.getValueFromObject(body, 'manufacturer_id'))
      .input('MANUFACTURERNAME', apiHelper.getValueFromObject(body, 'manufacturer_name'))
      .input('MANUFACTURERADDRESS', apiHelper.getValueFromObject(body, 'manufacturer_address'))
      .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
      .input('WEBSITE', apiHelper.getValueFromObject(body, 'website'))
      .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
      .input('DESCRIPTIONS', apiHelper.getValueFromObject(body, 'descriptions'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_MANUFACTURER_CREATEORUPDATE);
    const Id = result.recordset[0].RESULT;
    if (Id <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.MANUFACTURER.CREATE_FAILED);
    }
    removeCacheOptions();
    return new ServiceResponse(true,'',Id);
  } catch (error) {
    logger.error(error, { 'function': 'ManufacturerService.createManufacturerOrUpdate' });
    console.error('ManufacturerService.createManufacturerOrUpdate', error);
    // Return error
    return new ServiceResponse(false, e.message);
  }
};

const detailManufacturer = async (manufacturer_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('MANUFACTURERID', manufacturer_id)
      .execute(PROCEDURE_NAME.MD_MANUFACTURER_GETBYID);
    if (data.recordset && data.recordset.length > 0) {
      const record = manufacturerClass.detail(data.recordset[0]);
      return new ServiceResponse(true, '', record);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'ManufacturerService.detailManufacturer' });

    return new ServiceResponse(false, e.message);
  }
};

const changeStatusManufacturer = async (manufacturer_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('MANUFACTURERID', manufacturer_id)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_MANUFACTURER_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'ManufacturerService.changeStatusManufacturer'});
    return new ServiceResponse(false);
  }
};

const deleteManufacturer = async (manufacturer_id, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('MANUFACTURERID', manufacturer_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_MANUFACTURER_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'ManufacturerService.deleteManufacturer'});
    return new ServiceResponse(false, e.message);
  }
};
const getOptionsAll =async function () {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('IsActive', API_CONST.ISACTIVE.ALL)
      .execute(PROCEDURE_NAME.MD_MANUFACTURER_GETOPTIONS);

    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'ManufacturerService.getOptionsAll'});
    return [];
  }
};
const getOptions = async function (queryParams) {
  const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
  const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
  const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
  const dataCache = await cache.wrap(CACHE_CONST.MD_MANUFACTURER_OPTIONS, () => {
    return getOptionsAll();
  });
  // Filter values: empty, null, undefined
  const idsFilter = ids.filter((item) => { return item; });
  const dataFilter = _.filter(dataCache, (item) => {
    let isFilter = true;
    if(Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
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
  return new ServiceResponse(true, '', manufacturerClass.options(dataFilter));
};
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_MANUFACTURER_OPTIONS);
};
module.exports = {
  getListManufacturer,
  createManufacturerOrUpdate,
  detailManufacturer,
  deleteManufacturer,
  changeStatusManufacturer,
  getOptions,
};
