const setupServiceClass = require('../setup-service/setup-service.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const folderName = 'setup-service';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
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

      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_GETLISTMETATITLE_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': setupServiceClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.getListMetaTitle'});
    return new ServiceResponse(true, '', {});
  }
};

const getListMetaKeyword = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()

      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_GETLISTMETAKEYWORD_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': setupServiceClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.getListMetaKeyword'});
    return new ServiceResponse(true, '', {});
  }
};

const checkMetaTitle = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta-title'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_CHECKMETATITLE_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.SETUPSERVICE.EXISTS_METATITLE, null);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.checkMetaTitle'});
    return new ServiceResponse(false);
  }
};

const checkMetaKeyword = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta-keyword'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_CHECKMETAKEYWORD_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.SETUPSERVICE.EXISTS_METAKEYWORD, null);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.checkMetaKeyword'});
    return new ServiceResponse(false);
  }
};

const getListSetupService = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('WEBCATEGORYID', apiHelper.getValueFromObject(queryParams, 'webcategory_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': setupServiceClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.getListSetupService'});
    return new ServiceResponse(true, '', {});
  }
};

const detailSetupService = async (setupServiceId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('SETUPSERVICEID', setupServiceId)
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_GETBYID_ADMINWEB);
    let news = data.recordset;
    // If exists news
    if (news && news.length>0) {
      news = setupServiceClass.detail(news[0]);
      return new ServiceResponse(true, '', news);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.detailSetupService'});
    return new ServiceResponse(false, e.message);
  }
};

const createSetupService = async (bodyParams) => {
  try {
    const params = bodyParams;
    if(params.image_url) {
      const image_url = await saveImage(params.image_url);
      if (image_url)
        params.image_url = image_url;
      else
        return new ServiceResponse(false, RESPONSE_MSG.SETUPSERVICE.UPLOAD_FAILED);
    }
    const pool = await mssql.pool;
    //check name
    const dataCheck = await pool.request()
      .input('SETUPSERVICEID', apiHelper.getValueFromObject(bodyParams, 'setup_service_id'))
      .input('SETUPSERVICETITLE', apiHelper.getValueFromObject(bodyParams, 'setup_service_title'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_CHECKNAME_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.SETUPSERVICE.EXISTS_NAME, null);
    }
    const transaction = await new sql.Transaction(pool);
    // Begin transaction
    await transaction.begin();
    const requestSetupService = new sql.Request(transaction);
    const data = await requestSetupService
      .input('SETUPSERVICEID', apiHelper.getValueFromObject(bodyParams, 'setup_service_id'))
      .input('WEBCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'webcategory_id'))
      .input('SETUPSERVICETITLE', apiHelper.getValueFromObject(bodyParams, 'setup_service_title'))
      .input('CONTENT', apiHelper.getValueFromObject(bodyParams, 'content'))
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_key_words'))
      .input('METADESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'meta_descriptions'))
      .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
      .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
      .input('SYSTEMNAME', apiHelper.getValueFromObject(bodyParams, 'system_name_setup'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description'))
      .input('IMAGEFILEID', 1)
      .input('IMAGEURL', params.image_url)
      .input('SMALLTHUMBNAILIMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'small_thumbnail_image_file_id'))
      .input('SMALLTHUMBNAILIMAGEURL', apiHelper.getValueFromObject(bodyParams, 'small_thumbnail_image_url'))
      .input('MEDIUMTHUMBNAILIMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'medium_thumbnail_image_file_id'))
      .input('MEDIUMTHUMBNAILIMAGEURL', apiHelper.getValueFromObject(bodyParams, 'medium_thumbnail_image_url'))
      .input('LARGETHUMBNAILIMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'large_thumbnail_image_file_id'))
      .input('LARGETHUMBNAILIMAGEURL', apiHelper.getValueFromObject(bodyParams, 'large_thumbnail_image_url'))
      .input('XLARGETHUMBNAILIMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'xlarge_thumbnail_image_file_id'))
      .input('XLARGETHUMBNAILIMAGEURL', apiHelper.getValueFromObject(bodyParams, 'xlarge_thumbnail_image_url'))
      .input('ISSERVICEPACKAGE', apiHelper.getValueFromObject(bodyParams, 'is_service_package'))
      .input('ISSHOWHOME', apiHelper.getValueFromObject(bodyParams, 'is_show_home'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_CREATEORUPDATE_ADMINWEB);
    const setupServiceId = data.recordset[0].RESULT;
    if (setupServiceId <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.SETUPSERVICE.CREATE_FAILED);
    }
    transaction.commit();
    removeCacheOptions();
    return new ServiceResponse(true,'',setupServiceId);
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.createSetupService'});
    return new ServiceResponse(false);
  }
};

const deleteSetupService = async (setupServiceId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('SETUPSERVICEID',setupServiceId)
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.SETUPSERVICE.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.createSetupService'});
    return new ServiceResponse(false, e.message);
  }
};

const saveImage = async (base64) => {
  let url = null;
  try {
    if (fileHelper.isBase64(base64)) {
      const extentions = ['.jpeg', '.jpg', '.png', '.gif'];
      const extention = fileHelper.getExtensionFromBase64(base64, extentions);
      if (extention) {
        const guid = createGuid();
        url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extention}`);
      }
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      'function': 'newsService.saveImage',
    });
  }
  return url;
};

const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const changeStatusSetupService = async (setupServiceId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('SETUPSERVICEID', setupServiceId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_SETUPSERVICE_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'setupServiceService.changeStatusSetupService'});
    return new ServiceResponse(false);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CMS_SETUPSERVICE_OPTION);
};
module.exports = {
  getListSetupService,
  detailSetupService,
  createSetupService,
  deleteSetupService,
  changeStatusSetupService,
  getListMetaTitle,
  getListMetaKeyword,
  checkMetaTitle,
  checkMetaKeyword,
};
