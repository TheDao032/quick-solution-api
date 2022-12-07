const staticContentClass = require('../static-content/static-content.class');
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

const getListMetaTitle = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()

      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_GETLISTMETATITLE_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': staticContentClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'staticContentService.getListMetaTitle'});
    return new ServiceResponse(true, '', {});
  }
};

const getListMetaKeyword = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()

      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_GETLISTMETAKEYWORD_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': staticContentClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'staticContentService.getListMetaKeyword'});
    return new ServiceResponse(true, '', {});
  }
};

const checkMetaTitle = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta-title'))
      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_CHECKMETATITLE_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.STATICCONTENT.EXISTS_METATITLE, null);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'staticContentService.checkMetaTitle'});
    return new ServiceResponse(false);
  }
};

const checkMetaKeyword = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta-keyword'))
      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_CHECKMETAKEYWORD_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.STATICCONTENT.EXISTS_METAKEYWORD, null);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'staticContentService.checkMetaKeyword'});
    return new ServiceResponse(false);
  }
};

const getListStaticContent = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('WEBCATEGORYID', apiHelper.getValueFromObject(queryParams, 'webcategory_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': staticContentClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'storeService.getListStore'});
    return new ServiceResponse(true, '', {});
  }
};

const detailStaticContent = async (staticContentId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('STATICCONTENTID', staticContentId)
      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_GETBYID_ADMINWEB);

    let staticContent = data.recordset;
    // If exists STATIC CONTENT
    if (staticContent && staticContent.length>0) {
      staticContent = staticContentClass.detail(staticContent[0]);
      return new ServiceResponse(true, '', staticContent);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'staticContentService.detailStaticContent'});
    return new ServiceResponse(false, e.message);
  }
};
const createStaticContentOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    //check title
    //const dataCheck = await pool.request()
    //  .input('STATICCONTENTID', apiHelper.getValueFromObject(bodyParams, 'static_content_id'))
    //  .input('STATICTITLE', apiHelper.getValueFromObject(bodyParams, 'static_title'))
    //  .execute(PROCEDURE_NAME.CMS_STATICCONTENT_CHECKTITLE);
    //if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) { // used
    //  return new ServiceResponse(false, RESPONSE_MSG.STATICCONTENT.EXISTS_TITLE, null);
    //}
    //check seoname
    //const dataCheckSeo = await pool.request()
    //  .input('STATICCONTENTID', apiHelper.getValueFromObject(bodyParams, 'static_content_id'))
    //  .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
    //  .execute(PROCEDURE_NAME.CMS_STATICCONTENT_CHECKSEONAME);
    //if (!dataCheckSeo.recordset || !dataCheckSeo.recordset[0].RESULT) { // used
    //  return new ServiceResponse(false, RESPONSE_MSG.STATICCONTENT.EXISTS_SEONAME, null);
    //}

    //check system_name
    // const dataCheck = await pool.request()
    //   .input('STATICCONTENTID', apiHelper.getValueFromObject(bodyParams, 'static_content_id'))
    //   .input('SYSTEMNAME', apiHelper.getValueFromObject(bodyParams, 'system_name'))
    //   .execute(PROCEDURE_NAME.CMS_STATICCONTENT_CHECKSYSTEMNAME_ADMINWEB);
    // if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
    //   return new ServiceResponse(false, RESPONSE_MSG.STATICCONTENT.EXISTS_SYSTEMNAME, null);
    // }

    const data = await pool.request()
      .input('STATICCONTENTID', apiHelper.getValueFromObject(bodyParams, 'static_content_id'))
      .input('STATICTITLE', apiHelper.getValueFromObject(bodyParams, 'static_title'))
      .input('WEBCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'webcategory_id'))
      .input('SYSTEMNAME', apiHelper.getValueFromObject(bodyParams, 'system_name'))
      .input('STATICCONTENT', apiHelper.getValueFromObject(bodyParams, 'static_content'))
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_keywords'))
      .input('METADESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'meta_data_scriptions'))
      .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
      .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
      .input('DISPLAYORDER', apiHelper.getValueFromObject(bodyParams, 'display_order'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISCHILDRENT', apiHelper.getValueFromObject(bodyParams, 'is_childrent'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_CREATEORUPDATE_ADMINWEB);
    const staticContentId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',staticContentId);
  } catch (e) {
    logger.error(e, {'function': 'staticContentService.createStaticContentOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusStaticContent = async (staticContentId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('STATICCONTENTID', staticContentId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'staticContentService.changeStatusStaticContent'});

    return new ServiceResponse(false);
  }
};

const deleteStaticContent = async (staticContentId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('STATICCONTENTID',staticContentId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_STATICCONTENT_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.STATICCONTENT.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'staticContentService.deleteStaticContent'});
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListStaticContent,
  detailStaticContent,
  createStaticContentOrUpdate,
  changeStatusStaticContent,
  deleteStaticContent,
  getListMetaTitle,
  getListMetaKeyword,
  checkMetaTitle,
  checkMetaKeyword,
};
