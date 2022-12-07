const bannertypeClass = require('../bannertype/bannertype.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
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
const getListBannerType = async (queryParams = {}) => {
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
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CMS_BANNERTYPE_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': bannertypeClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'bannertypeService.getListBannerType'});
    return new ServiceResponse(true, '', {});
  }
};

const detailBannerType = async (banner_type_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BANNERTYPEID', banner_type_id)
      .execute(PROCEDURE_NAME.CMS_BANNERTYPE_GETBYID_ADMINWEB);

    let bannertype = data.recordset;

    if (bannertype && bannertype.length>0) {
      bannertype = bannertypeClass.detail(bannertype[0]);
      return new ServiceResponse(true, '', bannertype);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'bannertypeService.detailBannerType'});
    return new ServiceResponse(false, e.message);
  }
};
const createBannerTypeOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BANNERTYPEID', apiHelper.getValueFromObject(bodyParams, 'banner_type_id'))
      .input('BANNERTYPENAME', apiHelper.getValueFromObject(bodyParams, 'banner_type_name'))
      .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'descriptions'))
      .input('ISSHOWHOME', apiHelper.getValueFromObject(bodyParams, 'is_show_home'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_BANNERTYPE_CREATEORUPDATE_ADMINWEB);
    const banner_type_id = data.recordset[0].RESULT;
    removeCacheOptions();
    return new ServiceResponse(true,'',banner_type_id);
  } catch (e) {
    logger.error(e, {'function': 'bannertypeService.createBannerTypeOrUpdate'});
    return new ServiceResponse(false);
  }
};
const changeStatusBannerType = async (banner_type_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('BANNERTYPEID', banner_type_id)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_BANNERTYPE_UPDATESTATUS_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'bannertypeService.changeStatusBannerType'});

    return new ServiceResponse(false);
  }
};
const deleteBannerType = async (banner_type_id, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('BANNERTYPEID', banner_type_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_BANNERTYPE_DELETE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.BANNERTYPE.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'bannertypeService.deleteBannerType'});
    return new ServiceResponse(false, e.message);
  }
};

const checkParent = async (banner_type_id, bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('BANNERTYPEID', banner_type_id)
      .execute(PROCEDURE_NAME.CMS_BANNERTYPE_CHECKPARENT_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'bannertypeService.checkParent'});
    return new ServiceResponse(false);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CMS_BANNERTYPE_OPTIONS);
};
module.exports = {
  getListBannerType,
  detailBannerType,
  deleteBannerType,
  changeStatusBannerType,
  createBannerTypeOrUpdate,
  checkParent,
};
