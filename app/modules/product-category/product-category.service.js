const producCategoryClass = require('../product-category/product-category.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const folderNameIcon = 'product_category';
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListProductCategory = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
      .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_GETLIST);

    const lists = data.recordset;

    return new ServiceResponse(true, '', {
      'data': producCategoryClass.list(lists),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(lists),
    });
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.getListProductCategory'});
    return new ServiceResponse(true, '', {});
  }
};

const detail = async (Id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTCATEGORYID', Id)
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_GETBYID);
    let category = data.recordset;
    // If exists MD_AREA
    if (category && category.length>0) {
      category = producCategoryClass.detail(category[0]);
      return new ServiceResponse(true, '', category);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.detail'});
    return new ServiceResponse(false, e.message);
  }
};

const getListAttributeByCategory = async (Id) => {
  try {

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTCATEGORYID', Id)
      .execute(PROCEDURE_NAME.PRO_CATE_ATTRIBUTE_GETLISTBYCATEGORY);

    const datas = data.recordset;

    return new ServiceResponse(true, '',producCategoryClass.listAttributeByCategory(datas));
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.getListAttributeByCategory'});
    return new ServiceResponse(true, '', {});
  }
};

const saveIcon = async (base64) => {
  let avatarIcon = null;

  try {
    if(fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const d = new Date();
      const nameFile = String(d.getDay().toString())+d.getMonth().toString()+d.getFullYear().toString()+d.getHours().toString()+d.getMinutes().toString()+d.getSeconds().toString();
      avatarIcon = await fileHelper.saveBase64(folderNameIcon, base64, `${nameFile}.${extension}`);
    } else {
      avatarIcon = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.saveIcon'});

    return avatarIcon;
  }
  return avatarIcon;
};
// Create TaskType
const createProductCategoryOrUpdates = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const pathIcon = await saveIcon(apiHelper.getValueFromObject(bodyParams, 'icon_url'));
    // create table ProductCategotyCreate
    if(pathIcon === null || pathIcon === undefined || pathIcon ==='')
    {
      return new ServiceResponse(false,RESPONSE_MSG.PRODUCTCATEGORY.SAVEIMG_FAILED);
    }
    const requestProductCategotyCreate = new sql.Request(transaction);
    const dataProductCategotyCreate = await requestProductCategotyCreate
      .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
      .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
      .input('CATEGORYNAME', apiHelper.getValueFromObject(bodyParams, 'category_name'))
      .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web'))
      .input('NAMESHOWWEB', apiHelper.getValueFromObject(bodyParams, 'name_show_web'))
      .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
      .input('ADDFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'add_function_id'))
      .input('EDITFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'edit_function_id'))
      .input('DELETEFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'delete_function_id'))
      .input('VIEWFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'view_function_id'))
      .input('ICONURL', pathIcon)
      .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
      .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_CREATEORUPDATE);
    const productCategoryId = dataProductCategotyCreate.recordset[0].RESULT;
    if(productCategoryId <= 0)
    {
      return new ServiceResponse(false,RESPONSE_MSG.PRODUCTCATEGORY.CREATE_FAILED);
    }
    // check update
    const id = apiHelper.getValueFromObject(bodyParams, 'product_category_id');
    if(id && id !== '')
    {
      // if update -> delete table CRM_TASKTYPE_WFOLLOW
      const requestProCateAttributeDelete = new sql.Request(transaction);
      const dataProCateAttributeDelete = await requestProCateAttributeDelete
        .input('PRODUCTCATEGORYID', id)
        .execute(PROCEDURE_NAME.PRO_CATE_ATTRIBUTE_DELETE);
      const resultDelete = dataProCateAttributeDelete.recordset[0].RESULT;
      if(resultDelete <= 0)
      {
        return new ServiceResponse(false,RESPONSE_MSG.PRODUCTCATEGORY.UPDATE_FAILED);
      }
    }
    // create table CRM_TASKTYPE_WFOLLOW
    const list_attribute = apiHelper.getValueFromObject(bodyParams, 'list_attribute');
    if(list_attribute && list_attribute.length > 0)
    {
      for(let i = 0;i < list_attribute.length;i++) {
        const item = list_attribute[i];
        const requestProCateAttributeCreate = new sql.Request(transaction);
        const dataProCateAttributeCreate = await requestProCateAttributeCreate // eslint-disable-line no-await-in-loop
          .input('PRODUCTCATEGORYID', productCategoryId)
          .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(item, 'product_attribute_id'))
          .execute(PROCEDURE_NAME.PRO_CATE_ATTRIBUTE_CREATE);
        const taskProCateAttributeId = dataProCateAttributeCreate.recordset[0].RESULT;
        if(taskProCateAttributeId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.PRODUCTCATEGORY.CREATE_FAILED);
        }
      }
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true,'',productCategoryId);
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.createProductCategoryOrUpdates'});
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

const changeStatusProductCategory = async (productCategoryId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PRODUCTCATEGORYID', productCategoryId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.changeStatusProductCategory'});

    return new ServiceResponse(false);
  }
};

const deleteProductCategory = async (productCategoryId, bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    // check used 
    const requestTaskTypeCheckUsed = new sql.Request(transaction);
    const data = await requestTaskTypeCheckUsed
      .input('PRODUCTCATEGORYID', productCategoryId)
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_CHECKUSED);
    let used = producCategoryClass.detailUsed(data.recordset);
    if (used[0].result===1) { // used
      return new ServiceResponse(false, 'danh mục sản phẩm đang được sử dụng bởi '+used[0].table_used, null);
    }
    // remove table map CRM_TASKTYPE_WFOLLOW
    const requestProductAttrCategoryDelete = new sql.Request(transaction);
    const dataProductAttrCategoryDelete = await requestProductAttrCategoryDelete
      .input('PRODUCTCATEGORYID', productCategoryId)
      .execute(PROCEDURE_NAME.PRO_CATE_ATTRIBUTE_DELETE);
    const resultProductAttrCategoryDelete = dataProductAttrCategoryDelete.recordset[0].RESULT;
    if (resultProductAttrCategoryDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PRODUCTCATEGORY.DELETE_FAILED);
    }
    // remove table TASKTYPE
    const requestProductCategoryDelete = new sql.Request(transaction);
    const datatProductCategoryDelete = await requestProductCategoryDelete
      .input('PRODUCTCATEGORYID',productCategoryId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_DELETE);
    const resultProductCategoryDelete = datatProductCategoryDelete.recordset[0].RESULT;
    if (resultProductCategoryDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PRODUCTCATEGORY.DELETE_FAILED);
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true, RESPONSE_MSG.PRODUCTCATEGORY.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.deleteProductCategory'});
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};
const getFunctionsByUserGroupId = async function (queryParams) {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('USERGROUPID', apiHelper.getValueFromObject(queryParams, 'user_groups'))
      .execute(PROCEDURE_NAME.SYS_USER_GETPERMISSIONBYUSERGROUP);

    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.getFunctionsByUserGroupId'});
    return [];
  }
};
const getOptionsAll = async (typeFuctions,queryParams = {}) => {
  try {
    // Get parameter
    const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
    const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
    const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
    const isAdministrator = apiHelper.getValueFromObject(queryParams, 'isAdministrator');
    // Get data from cache
    const data = await cache.wrap(CACHE_CONST.MD_PRODUCTCATEGORY_OPTIONS, () => {
      return getOptions();
    });
    //get list functions of usergroupid
    const getDataFunctions = await getFunctionsByUserGroupId(queryParams);
    const dataFunctions = producCategoryClass.listFunctions(getDataFunctions);
    // Filter values: empty, null, undefined
    const idsFilter = ids.filter((item) => { return item; });
    const dataFilter = _.filter(data, (item) => {
      let isFilter = true;
      if(Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
        isFilter = false;
      }
      if(idsFilter.length && !idsFilter.includes(item.ID.toString())) {
        isFilter = false;
      }
      if(parentId && Number(parentId) !== item.PARENTID) {
        isFilter = false;
      }
      if(!dataFunctions || dataFunctions.length === 0)
      {
        isFilter = false;
      }
      if(isAdministrator !== 1)
      {
      // check quyền xem và xóa cho getoptions list
        if(typeFuctions && (typeFuctions.includes('EDITFUNCTIONID') || typeFuctions.includes('DELETEFUNCTIONID')))
        {
        // if check function edit or delete, nếu k có quyền thì k hiển thị item
          if(dataFunctions && dataFunctions.length && !dataFunctions.filter((vendor) => (vendor.function_id === item.EDITFUNCTIONID)).length > 0 && !dataFunctions.filter((vendor) => (vendor.function_id === item.DELETEFUNCTIONID)).length > 0 && !dataFunctions.filter((vendor) => (vendor.function_id === item.VIEWFUNCTIONID)).length > 0)
          {
            isFilter = false;
          }
        }
        else if (typeFuctions && typeFuctions.includes('ADDFUNCTIONID'))
        {
          if(dataFunctions && dataFunctions.length && !dataFunctions.filter((vendor) => (vendor.function_id === item.ADDFUNCTIONID)).length>0)
          {
            isFilter = false;
          }
        }
      }

      if(isFilter) {
        item.ADD=false;
        item.EDIT=false;
        item.DELETE=false;
        item.VIEW=false;
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.EDITFUNCTIONID)).length>0)
        {
          item.EDIT=true;
        }
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.DELETEFUNCTIONID)).length>0)
        {
          item.DELETE=true;
        }
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.ADDFUNCTIONID)).length>0)
        {
          item.ADD=true;
        }
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.VIEWFUNCTIONID)).length>0)
        {
          item.VIEW=true;
        }
        return item;
      }
      return null;
    });

    return new ServiceResponse(true, '', producCategoryClass.options(dataFilter));
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.getOptionsAll'});

    return new ServiceResponse(true, '', []);
  }
};
const getOptions = async function () {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('IsActive', API_CONST.ISACTIVE.ALL)
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_GETOPTIONS);

    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'productCategoryService.getOptions'});
    return [];
  }
};
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_PRODUCTCATEGORY_OPTIONS);
};

module.exports = {
  getListProductCategory,
  detail,
  getListAttributeByCategory,
  createProductCategoryOrUpdates,
  changeStatusProductCategory,
  deleteProductCategory,
  getOptionsAll,
};
