const newsCategoryClass = require('../news-category/news-category.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const fileHelper = require('../../common/helpers/file.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const folderName = 'newscategorypicture';
const config = require('../../../config/config');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListNewsCategory = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': newsCategoryClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.getListNewsCategory'});
    return new ServiceResponse(true, '', {});
  }
};

const getListAllNewsCategory = async (newsCategoryId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PARENTID', newsCategoryId)
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_GETLISTALL_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': newsCategoryClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.getAllListNewsCategory'});
    return new ServiceResponse(true, '', {});
  }
};

const detailNewsCategory = async (newsCategoryId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('NEWSCATEGORYID', newsCategoryId)
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_GETBYID_ADMINWEB);

    let newsCategory = data.recordset;
    // If exists news category
    if (newsCategory && newsCategory.length>0) {
      newsCategoryClass.pictures = '543354';
      newsCategory = newsCategoryClass.detail(newsCategory[0]);
      return new ServiceResponse(true, '', newsCategory);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.detailNewsCategory'});
    return new ServiceResponse(false, e.message);
  }
};

const savePicture = async (base64) => {
  let url = null;

  try {
    if(fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const d = new Date();
      const nameFile = String(d.getDay().toString())+d.getMonth().toString()+d.getFullYear().toString()+d.getHours().toString()+d.getMinutes().toString()+d.getSeconds().toString();
      url = await fileHelper.saveBase64(folderName, base64, `${nameFile}.${extension}`);
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.savePicture'});
    return url;
  }
  return url;
};

const createNewsCategoryOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const pathPictures = await savePicture(apiHelper.getValueFromObject(bodyParams, 'pictures'));
    // create table ProductCategotyCreate
    if(pathPictures === null || pathPictures === undefined || pathPictures ==='')
    {
      return new ServiceResponse(false,RESPONSE_MSG.NEWSCATEGORY.SAVEIMG_FAILE);
    }

    //check name
    const dataCheck = await pool.request()
      .input('NEWSCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'news_category_id'))
      .input('NEWSCATEGORYNAME', apiHelper.getValueFromObject(bodyParams, 'news_category_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_CHECKNAME_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWSCATEGORY.EXISTS_NAME, null);
    }
    //check orderindex
    const dataCheckOrderIndex = await pool.request()
      .input('NEWSCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'news_category_id'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_CHECKORDERINDEX_ADMINWEB);
    if (!dataCheckOrderIndex.recordset || !dataCheckOrderIndex.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWSCATEGORY.EXISTS_ORDERINDEX, null);
    }

    const data = await pool.request()
      .input('NEWSCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'news_category_id'))
      .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
      .input('NEWSCATEGORYNAME', apiHelper.getValueFromObject(bodyParams, 'news_category_name'))
      .input('IMAGEURL', pathPictures)
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_key_words'))
      .input('METADESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'meta_descriptions'))
      .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
      .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
      .input('CATEGORYLEVEL', apiHelper.getValueFromObject(bodyParams, 'category_level'))
      .input('IMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'image_file_id'))
      .input('ISCATEVIDEO', apiHelper.getValueFromObject(bodyParams, 'is_cate_video'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_CREATEORUPDATE_ADMINWEB);
    const newsCategoryId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',newsCategoryId);
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.createNewsCategoryOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusNewsCategory = async (newsCategoryId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('NEWSCATEGORYID', newsCategoryId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.changeStatusNewsCategory'});
    return new ServiceResponse(false);
  }
};

const deleteNewsCategory = async (newsCategoryId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('NEWSCATEGORYID',newsCategoryId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.NEWSCATEGORY.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.deleteNewsCategory'});
    return new ServiceResponse(false, e.message);
  }
};

const checkOrderIndexNewsCategory = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('NEWSCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'news_category_id'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_CHECKORDERINDEX_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWSCATEGORY.EXISTS_ORDERINDEX, null);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.checkOrderIndexNewsCategory'});
    return new ServiceResponse(false);
  }
};

const checkParent = async (newsCategoryId, bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('NEWSCATEGORYID',newsCategoryId)
      .execute(PROCEDURE_NAME.NEWS_NEWSCATEGORY_CHECKPARENT_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'newsCategoryService.checkParent'});
    return new ServiceResponse(false);
  }
};

module.exports = {
  getListNewsCategory,
  detailNewsCategory,
  createNewsCategoryOrUpdate,
  deleteNewsCategory,
  changeStatusNewsCategory,
  getListAllNewsCategory,
  checkOrderIndexNewsCategory,
  checkParent,
};
