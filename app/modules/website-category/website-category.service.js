const websiteCategoryClass = require('../website-category/website-category.class');
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
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListWebsiteCategory = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('WEBSITEID', apiHelper.getValueFromObject(queryParams, 'website_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': websiteCategoryClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'websiteCategoryService.getListWebsiteCategory'});
    return new ServiceResponse(true, '', {});
  }
};

const getListAllWebsiteCategory = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_GETLISTALL_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': websiteCategoryClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'websiteCategoryService.getListAllWebsiteCategory'});
    return new ServiceResponse(true, '', {});
  }
};


const detailWebsiteCategory = async (websiteCategoryId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('WEBCATEGORYID', websiteCategoryId)
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_GETBYID_ADMINWEB);
    if (data.recordsets && data.recordsets.length > 0) {
      if (data.recordsets[0].length > 0) {
        const detail = data.recordsets[0];
        const categoryname = data.recordsets[1];
        const newscategoryname = data.recordsets[2];
        const manufacturename = data.recordsets[3];
        let record = websiteCategoryClass.detail(detail[0]);
        record.categoryname = websiteCategoryClass.listCategoryName(categoryname);
        record.newscategoryname = websiteCategoryClass.listNewsCategoryName(newscategoryname);
        record.manufacturename = websiteCategoryClass.listManufacturerName(manufacturename);
        return new ServiceResponse(true, '', record);
      }
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'websiteCategoryService.detailWebsiteCategory'});
    return new ServiceResponse(false, e.message);
  }
};

const createWebsiteCategoryOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    //check name
    const dataCheck = await pool.request()
      .input('WEBCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'web_category_id'))
      .input('CATEGORYNAME', apiHelper.getValueFromObject(bodyParams, 'category_name'))
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_CHECKNAME_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.WEBSITECATEGORY.EXISTS_NAME, null);
    }
    const transaction = await new sql.Transaction(pool);
    // Begin transaction
    await transaction.begin();
    const requestWebCategory = new sql.Request(transaction);
    const data = await requestWebCategory
      .input('WEBCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'web_category_id'))
      .input('WEBSITEID', apiHelper.getValueFromObject(bodyParams, 'website_id'))
      .input('CATEGORYNAME', apiHelper.getValueFromObject(bodyParams, 'category_name'))
      .input('CATEPARENTID', apiHelper.getValueFromObject(bodyParams, 'cate_parent_id'))
      .input('URLCATEGORY', apiHelper.getValueFromObject(bodyParams, 'url_category'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_CREATEORUPDATE_ADMINWEB);
    const websiteCategoryId = data.recordset[0].RESULT;
    if (websiteCategoryId <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.WEBSITECATEGORY.CREATE_FAILED);
    }
    const list_product_category = apiHelper.getValueFromObject(bodyParams, 'list_product_category');
    if (list_product_category && list_product_category.length > 0) {
      for (let i = 0; i < list_product_category.length; i++)
      {
        const item = list_product_category[i];
        const requestChild = new sql.Request(transaction);
        const resultChild = await requestChild // eslint-disable-line no-await-in-loop
          .input('WEBCATEGORYID', websiteCategoryId)
          .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(item, 'product_category_id'))
          .execute(PROCEDURE_NAME.CMS_PRONEWSWEBCATEGORY_CREATEORUPDATE_ADMINWEB);
        const child_id = resultChild.recordset[0].RESULT;
        if (child_id <= 0) {
          return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
        }
      }
    }
    const list_news_category = apiHelper.getValueFromObject(bodyParams, 'list_news_category');
    if (list_news_category && list_news_category.length > 0) {
      for (let i = 0; i < list_news_category.length; i++) {
        const item = list_news_category[i];
        const requestChild = new sql.Request(transaction);
        const resultChild = await requestChild // eslint-disable-line no-await-in-loop
          .input('WEBCATEGORYID', websiteCategoryId)
          .input('NEWSCATEGORYID', apiHelper.getValueFromObject(item, 'news_category_id'))
          .execute(PROCEDURE_NAME.CMS_PRONEWSWEBCATEGORY_CREATEORUPDATE_ADMINWEB);
        const child_id = resultChild.recordset[0].RESULT;
        if (child_id <= 0) {
          return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
        }
      }
    }

    const list_manufacture = apiHelper.getValueFromObject(bodyParams, 'list_manufacture');
    if (list_manufacture && list_manufacture.length > 0) {
      for (let i = 0; i < list_manufacture.length; i++) {
        const item = list_manufacture[i];
        const requestChild = new sql.Request(transaction);
        const resultChild = await requestChild // eslint-disable-line no-await-in-loop
          .input('WEBCATEGORYID', websiteCategoryId)
          .input('MANUFACTURERID', apiHelper.getValueFromObject(item, 'manufacture_id'))
          .execute(PROCEDURE_NAME.CMS_PRONEWSWEBCATEGORY_CREATEORUPDATE_ADMINWEB);
        const child_id = resultChild.recordset[0].RESULT;
        if (child_id <= 0) {
          return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
        }
      }
    }
    transaction.commit();
    removeCacheOptions();
    return new ServiceResponse(true,'',websiteCategoryId);
  } catch (e) {
    logger.error(e, {'function': 'websiteCategoryService.createWebsiteCategoryOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusWebsiteCategory = async (websiteCategoryId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('WEBCATEGORYID', websiteCategoryId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'websiteCategoryService.changeStatusWebsiteCategory'});
    return new ServiceResponse(false);
  }
};


const deleteWebsiteCategory = async (websiteCategoryId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('WEBCATEGORYID',websiteCategoryId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.WEBSITECATEGORY.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'websiteCategoryService.deleteWebsiteCategory'});
    return new ServiceResponse(false, e.message);
  }
};

const getListAllWebsite = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute(PROCEDURE_NAME.CMS_WEBSITE_GETLISTALL_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': websiteCategoryClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'websiteCategoryService.getListAllWebsite'});
    return new ServiceResponse(true, '', {});
  }
};

const getListAllParent = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_PARENT_GETLISTALL_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': websiteCategoryClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'websiteCategoryService.getListAllParent'});
    return new ServiceResponse(true, '', {});
  }
};
const detailWebsite = async (websiteId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('WEBSITEID', websiteId)
      .execute(PROCEDURE_NAME.CMS_WEBSITE_GETBYID_ADMINWEB);

    let website = data.recordset;
    // If exists news category
    if (website && website.length>0) {
      website = websiteCategoryClass.detailWebsite(website[0]);
      return new ServiceResponse(true, '', website);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'websiteService.detailWebsite'});
    return new ServiceResponse(false, e.message);
  }
};

const checkParent = async (websiteId, bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('WEBCATEGORYID', websiteId)
      .execute(PROCEDURE_NAME.CMS_WEBSITECATEGORY_CHECKPARENT_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'websiteService.checkParent'});
    return new ServiceResponse(false);
  }
};
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CMS_WEBSITECATEGORY_OPTION);
};
module.exports = {
  getListWebsiteCategory,
  detailWebsiteCategory,
  createWebsiteCategoryOrUpdate,
  deleteWebsiteCategory,
  changeStatusWebsiteCategory,
  getListAllWebsiteCategory,
  getListAllWebsite,
  getListAllParent,
  detailWebsite,
  checkParent,
};
