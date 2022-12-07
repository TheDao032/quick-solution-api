/* eslint-disable no-await-in-loop */
const productClass = require('../product/product.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const folderName = 'productpicture';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListProduct = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
      .input('STATUSPRODUCTID', apiHelper.getValueFromObject(queryParams, 'status_product_id'))
      .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('ISSHOWWEB', apiHelper.getFilterBoolean(queryParams, 'is_show_web'))
      .input('ISSERVICE', apiHelper.getFilterBoolean(queryParams, 'is_serivce'))
      .input('ISAMOUNTDAYS', apiHelper.getFilterBoolean(queryParams, 'is_amount_days'))
      .input('ISSESSION', apiHelper.getFilterBoolean(queryParams, 'is_session'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('USERID', apiHelper.getValueFromObject(queryParams, 'auth_id'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETLIST);

    const dataRecord = data.recordset;
    let products = productClass.list(dataRecord);
    for (let i = 0; i < products.length; i++) {
      const dataBus = await pool.request() // eslint-disable-next-line no-await-in-loop
        .input('PRODUCTID', apiHelper.getValueFromObject(products[i], 'product_id'))
        .execute(PROCEDURE_NAME.MD_PRODUCT_BUSINESS_GETLISTBYPRODUCTID);
      const dataRecordBus = dataBus.recordset;
      products[i].businesses = [];
      if(dataRecordBus) {
        products[i].businesses = productClass.listBussiness(dataRecordBus);
      }
      const dataPrice = await pool.request() // eslint-disable-next-line no-await-in-loop
        .input('PRODUCTID', apiHelper.getValueFromObject(products[i], 'product_id'))
        .input('ISREVIEW', 1)
        .input('ISACTIVE', 1)
        .execute(PROCEDURE_NAME.SL_PRICES_GETBYPRODUCTID);
      const dataRecordPrice = dataPrice.recordset;
      products[i].prices = [];
      if(dataRecordPrice) {
        products[i].prices = productClass.listPrice(dataRecordPrice);
      }
    }
    return new ServiceResponse(true, '', {
      'data': products,
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(dataRecord),
    });
  } catch (e) {
    logger.error(e, {
      'function': 'ProductService.getListProduct',
    });
    return new ServiceResponse(false, e.message);
  }
};

const createProductOrUpdate = async (body = {}) => {
  let pictures = apiHelper.getValueFromObject(body, 'pictures');
  if (pictures && pictures.length > 0) {
    for (let i = 0; i < pictures.length; i++) {
      const item = pictures[i];
      const picture_url = await savePicture(item.picture_url, item.picture_alias); // eslint-disable-line no-await-in-loop
      if (picture_url)
        item.picture_url = picture_url;
      else
        return new ServiceResponse(false, RESPONSE_MSG.FILEATTACTMENT.UPLOAD_FAILED);
    }
  }

  const pool = await mssql.pool;
  try {
    const dataCheck = await pool.request()
      .input('PRODUCTID', apiHelper.getValueFromObject(body, 'product_id'))
      .input('PRODUCTCODE', apiHelper.getValueFromObject(body, 'product_code'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_CHECKNAME);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) { // used
      return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CHECK_CODE_FAILED, null);
    }
    const transaction = await new sql.Transaction(pool);
    // Begin transaction
    await transaction.begin();
    // Save Product
    const requestProduct = new sql.Request(transaction);
    const resultProduct = await requestProduct
      .input('PRODUCTID', apiHelper.getValueFromObject(body, 'product_id'))
      .input('MANUFACTURERID', apiHelper.getValueFromObject(body, 'manufacturer_id'))
      .input('STATUSPRODUCTID', apiHelper.getValueFromObject(body, 'status_product_id'))
      .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(body, 'product_category_id'))
      .input('PRODUCTCODE', apiHelper.getValueFromObject(body, 'product_code'))
      .input('PRODUCTNAME', apiHelper.getValueFromObject(body, 'product_name'))
      .input('PRODUCTNAMESHOWWEB', apiHelper.getValueFromObject(body, 'product_name_show_web'))
      .input('PRODUCTIMEI', apiHelper.getValueFromObject(body, 'product_imei'))
      .input('MODELID', apiHelper.getValueFromObject(body, 'model_id'))
      .input('PRODUCTCONTENTDETAIL', apiHelper.getValueFromObject(body, 'product_content_detail'))
      .input('LOTNUMBER', apiHelper.getValueFromObject(body, 'lot_number'))
      .input('ORIGINID', apiHelper.getValueFromObject(body, 'origin_id'))
      .input('DESCRIPTIONS', apiHelper.getValueFromObject(body, 'descriptions'))
      .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(body, 'short_description'))
      .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
      .input('ISSHOWWEB', apiHelper.getValueFromObject(body, 'is_show_web'))
      .input('ISSHOWHOME', apiHelper.getValueFromObject(body, 'is_show_home'))
      .input('ISSERVICE', apiHelper.getValueFromObject(body, 'is_service'))
      .input('ISSELLWELL', apiHelper.getValueFromObject(body, 'is_sell_well'))
      .input('ISHIGHLIGHT', apiHelper.getValueFromObject(body, 'is_high_light'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_CREATEORUPDATE);
    const product_id = resultProduct.recordset[0].RESULT;
    if (product_id <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
    }
    //Delete child table
    const requestPictureDel = new sql.Request(transaction);
    const resultPictureDel = await requestPictureDel
      .input('PRODUCTID', product_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_PRODUCTIMAGES_DELETEBYPRODUCTID);
    if (resultPictureDel.recordset[0].RESULT <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
    }
    const requestBusinessDel = new sql.Request(transaction);
    const resultBusinessDel = await requestBusinessDel
      .input('PRODUCTID', product_id)
      .execute(PROCEDURE_NAME.MD_PRODUCT_BUSINESS_DELETEBYPRODUCTID);
    if (resultBusinessDel.recordset[0].RESULT <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
    }
    const requestAttributeDel = new sql.Request(transaction);
    const resultAttributeDel = await requestAttributeDel
      .input('PRODUCTID', product_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTEVALUES_DELETEBYPRODUCTID);
    if (resultAttributeDel.recordset[0].RESULT <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
    }
    const requestServiceDel = new sql.Request(transaction);
    const resultServiceDel = await requestServiceDel
      .input('PRODUCTID', product_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_PRODUCTSERVICES_DELETEBYPRODUCTID);
    if (resultServiceDel.recordset[0].RESULT <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
    }
    //Insert child table
    if (pictures && pictures.length > 0) {
      for (let i = 0; i < pictures.length; i++) {
        const item = pictures[i];
        const requestChild = new sql.Request(transaction);
        const resultChild = await requestChild // eslint-disable-line no-await-in-loop
          .input('PRODUCTID', product_id)
          .input('PICTUREURL', apiHelper.getValueFromObject(item, 'picture_url'))
          .input('PICTUREALIAS', apiHelper.getValueFromObject(item, 'picture_alias'))
          .input('ISDEFAULT', apiHelper.getValueFromObject(item, 'is_default'))
          .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
          .execute(PROCEDURE_NAME.PRO_PRODUCTIMAGES_CREATE);
        const child_id = resultChild.recordset[0].RESULT;
        if (child_id <= 0) {
          return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
        }
      }
    }
    if (body.businesses && body.businesses.length > 0) {
      for (let i = 0; i < body.businesses.length; i++) {
        const item = body.businesses[i];
        const requestChild = new sql.Request(transaction);
        const resultChild = await requestChild // eslint-disable-line no-await-in-loop
          .input('PRODUCTID', product_id)
          .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
          .execute(PROCEDURE_NAME.MD_PRODUCT_BUSINESS_CREATE);
        const child_id = resultChild.recordset[0].RESULT;
        if (child_id <= 0) {
          return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
        }
      }
    }
    if (apiHelper.getValueFromObject(body, 'is_service') > 0) {
      const requestChild = new sql.Request(transaction);
      const resultChild = await requestChild // eslint-disable-line no-await-in-loop
        .input('PRODUCTID', product_id)
        .input('PTLEVELID', apiHelper.getValueFromObject(body, 'pt_level_id'))
        .input('ISAMOUNTDAYS', apiHelper.getValueFromObject(body, 'is_amount_days'))
        .input('ISSESSION', apiHelper.getValueFromObject(body, 'is_session'))
        .input('TIMELIMIT', apiHelper.getValueFromObject(body, 'time_limit'))
        .input('VALUESIN', apiHelper.getValueFromObject(body, 'values_in'))
        .input('TIMEPERSESSION', apiHelper.getValueFromObject(body, 'time_per_session'))
        .input('ISFREEZE', apiHelper.getValueFromObject(body, 'is_freeze'))
        .input('ISTRANFER', apiHelper.getValueFromObject(body, 'is_tranfer'))
        .input('ISAPPLYSUN', apiHelper.getValueFromObject(body, 'is_apply_sun'))
        .input('ISAPPLYMON', apiHelper.getValueFromObject(body, 'is_apply_mon'))
        .input('ISAPPLYTU', apiHelper.getValueFromObject(body, 'is_apply_tu'))
        .input('ISAPPLYWE', apiHelper.getValueFromObject(body, 'is_apply_we'))
        .input('ISAPPLYTH', apiHelper.getValueFromObject(body, 'is_apply_th'))
        .input('ISAPPLYSA', apiHelper.getValueFromObject(body, 'is_apply_sa'))
        .input('ISAPPLYFR', apiHelper.getValueFromObject(body, 'is_apply_fr'))
        .input('FROMHOURS', apiHelper.getValueFromObject(body, 'from_hour'))
        .input('TOHOURS', apiHelper.getValueFromObject(body, 'to_hour'))
        .input('ISPRODUCTOFFPEAK', apiHelper.getValueFromObject(body, 'is_product_off_peak'))
        .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
        .execute(PROCEDURE_NAME.PRO_PRODUCTSERVICES_CREATE);
      const child_id = resultChild.recordset[0].RESULT;
      if (child_id <= 0) {
        return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
      }
    } else {
      if (body.attribute_values && body.attribute_values.length > 0) {
        for (let i = 0; i < body.attribute_values.length; i++) {
          const item = body.attribute_values[i];
          const requestChild = new sql.Request(transaction);
          const resultChild = await requestChild // eslint-disable-line no-await-in-loop
            .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(item, 'product_attribute_id'))
            .input('ATTRIBUTEVALUES', apiHelper.getValueFromObject(item, 'attribute_values'))
            .input('PRODUCTID', product_id)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTEVALUES_CREATE);
          const child_id = resultChild.recordset[0].RESULT;
          if (child_id <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.PRODUCT.CREATE_FAILED);
          }
        }
      }
    }
    transaction.commit();
    removeCacheOptions();
    return new ServiceResponse(true, '', product_id);
  } catch (error) {
    logger.error(error, {
      'function': 'ProductService.createProductOrUpdate',
    });
    console.error('ProductService.createProductOrUpdate', error);
    // Return error
    return new ServiceResponse(false, e.message);
  }
};

const detailProduct = async (product_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('PRODUCTID', product_id)
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETBYID);
    if (data.recordsets && data.recordsets.length > 0) {
      if (data.recordsets[0].length > 0) {
        const products = data.recordsets[0];
        const pictures = data.recordsets[1];
        let record = productClass.detail(products[0]);
        record.pictures = productClass.listPicture(pictures);
        const businesses = data.recordsets[2];
        record.businesses = productClass.listBussiness(businesses);
        if (record.is_service < 1) {
          const attribute_values = data.recordsets[3];
          record.attribute_values = productClass.listAttributeValues(attribute_values);
        } else {
          const services = data.recordsets[4];
          if (data.recordsets[4].length > 0) {
            const service = productClass.detailService(services[0]);
            record = Object.assign(record, service);
          }
        }
        return new ServiceResponse(true, '', record);
      }
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {
      'function': 'ProductService.detailProduct',
    });

    return new ServiceResponse(false, e.message);
  }
};

const changeStatusProduct = async (product_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PRODUCTID', product_id)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'ProductService.changeStatusProduct',
    });
    return new ServiceResponse(false);
  }
};

const deleteProduct = async (product_id, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('PRODUCTID', product_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'ProductService.deleteProduct',
    });
    return new ServiceResponse(false, e.message);
  }
};
const getOptions = async function (queryParams) {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
      .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
      .input('ORIGINID', apiHelper.getValueFromObject(queryParams, 'origin_id'))
      .input('ISSHOWWEB', apiHelper.getFilterBoolean(queryParams, 'is_show_web'))
      .input('ISSERVICE', apiHelper.getFilterBoolean(queryParams, 'is_service'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('IDS', apiHelper.getValueFromObject(queryParams, 'ids'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETOPTIONS);
    return new ServiceResponse(true, '', productClass.options(data.recordset));
  } catch (e) {
    logger.error(e, {
      'function': 'ProductService.getOptions',
    });
    return new ServiceResponse(false, e.message);
  }
};
const savePicture = async (base64, filename) => {
  let url = null;
  try {
    if (fileHelper.isBase64(base64)) {
      const extentions = ['.jpeg', '.jpg', '.png', '.gif'];
      const extention = fileHelper.getExtensionFromFileName(filename, extentions);
      if (extention) {
        const guid = createGuid();
        url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extention}`);
      }
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      'function': 'ProductService.savePicture',
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
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_PRODUCT_OPTIONS);
};
module.exports = {
  getListProduct,
  createProductOrUpdate,
  detailProduct,
  deleteProduct,
  changeStatusProduct,
  getOptions,
};
