const PriceClass = require('../sl-prices/sl-prices.class');
const outputTypeClass = require('../output-type/output-type.class');
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
const _ = require('lodash');
const API_CONST = require('../../common/const/api.const');

/**
 * Get list SL_PRICES
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListPrice = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const orderBy = apiHelper.getOrderBy(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      // .input('ORDERBYDES', orderBy)
      .input('OUTPUTTYPEID', apiHelper.getValueFromObject(queryParams, 'output_type_id'))
      .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('ISSERVICE', apiHelper.getFilterBoolean(queryParams, 'is_service'))
      .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
      .input('STARTDATE', apiHelper.getValueFromObject(queryParams, 'start_date'))
      .input('ENDDATE', apiHelper.getValueFromObject(queryParams, 'end_date'))
      .input('ISOUTPUTFORWEB', apiHelper.getFilterBoolean(queryParams, 'is_output_for_web'))
      .execute(PROCEDURE_NAME.SL_PRICES_GETLIST);

    const prices = data.recordset;

    return new ServiceResponse(true, '', {
      'data': PriceClass.list(prices),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(prices),
    });
  } catch (e) {
    logger.error(e, {'function': 'priceService.getListPrice'});

    return new ServiceResponse(true, '', {});
  }
};

/**
 * Create SL_PRICES
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createPrice = async (bodyParams = {}) => {
  return await createOrUpdatePrice(bodyParams);
};

const updatePrice = async (bodyParams = {}) => {
  return await createOrUpdatePrice(bodyParams);
};

const createOrUpdatePrice = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();
    // check trung giá
    let areaId = '|';
    let businessId ='|';
    const list_business = apiHelper.getValueFromObject(bodyParams, 'list_business_apply');
    if(list_business && list_business.length > 0)
    {
      for(let i = 0;i < list_business.length;i++) {
        const item = list_business[i];
        areaId+=apiHelper.getValueFromObject(item, 'area_id')+'|';
        businessId+=apiHelper.getValueFromObject(item, 'business_id')+'|';
      }
    }
    const checkTrungPrice = new sql.Request(transaction);
    const datacheckTrungPrice = await checkTrungPrice
      .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
      .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
      .input('AREAID', areaId)
      .input('BUSINESSID', businessId)
      .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
      .input('PRICEID', apiHelper.getValueFromObject(bodyParams, 'price_id'))
      .execute(PROCEDURE_NAME.SL_PRICES_CheckTrung);
    const resultCheck = datacheckTrungPrice.recordset[0].RESULT;
    if(resultCheck>0)
    {
      return new ServiceResponse(false,RESPONSE_MSG.SL_PRICES.CHECK_TRUNG);
    }
    // Save SL_PRICES
    const requestPrice = new sql.Request(transaction);
    const resultPrice = await requestPrice
      .input('PRICEID', apiHelper.getValueFromObject(bodyParams, 'price_id'))
      .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
      .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
      .input('PRICE', apiHelper.getValueFromObject(bodyParams, 'price'))
      .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
      .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
      .input('REVIEWDATE', apiHelper.getValueFromObject(bodyParams, 'review_date'))
      .input('NOTES', apiHelper.getValueFromObject(bodyParams, 'notes'))
      .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISOUTPUTFORWEB', apiHelper.getValueFromObject(bodyParams, 'is_output_for_web'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_PRICES_CREATEORUPDATE);
    // Get PRICEID
    const priceId = resultPrice.recordset[0].RESULT;
    if(! priceId) {
      throw new Error(RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
    }
    // insert apply outputtype
    // check update
    const id = apiHelper.getValueFromObject(bodyParams, 'price_id');
    if(id && id !== '')
    {
      // if update -> delete table SL_PRICE_APPLY_OUTPUTTYPE_BUSINESS
      const requestApplyOutputtypeDelete = new sql.Request(transaction);
      const dataApplyPutputtypeDelete = await requestApplyOutputtypeDelete
        .input('PRICEID', id)
        .execute(PROCEDURE_NAME.SL_PRICE_APPLY_BUSINESS_OUTPUTTYPE_BUSINESS_DELETE);
      const resultDelete = dataApplyPutputtypeDelete.recordset[0].RESULT;
      if(resultDelete <= 0)
      {
        return new ServiceResponse(false,RESPONSE_MSG.SL_PRICES.UPDATE_FAILED);
      }
      // if update -> delete table SL_PRICE_APPLY_REVIEWLEVEL_Delete
      const requestApplyReviewDelete = new sql.Request(transaction);
      const dataApplyReviewDelete = await requestApplyReviewDelete
        .input('PRICEID', id)
        .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_DELETE);
      const resultReviewDelete = dataApplyReviewDelete.recordset[0].RESULT;
      if(resultReviewDelete <= 0)
      {
        return new ServiceResponse(false,RESPONSE_MSG.SL_PRICES.UPDATE_FAILED);
      }
    }
    const list_business_apply = apiHelper.getValueFromObject(bodyParams, 'list_business_apply');
    if(list_business_apply && list_business_apply.length > 0)
    {
      for(let i = 0;i < list_business_apply.length;i++) {
        const item = list_business_apply[i];
        const requestApplyOutputtypeCreate = new sql.Request(transaction);
        const dataTaskApplyPutputtypeCreate = await requestApplyOutputtypeCreate // eslint-disable-line no-await-in-loop
          .input('PRICEID', priceId)
          .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
          .input('AREAID', apiHelper.getValueFromObject(item, 'area_id'))
          .input('COMPANYID', apiHelper.getValueFromObject(item, 'company_id'))
          .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
          .execute(PROCEDURE_NAME.SL_PRICES_APPLY_OUTPUTTYPE_CREATEORUPDATE);
        const applyOutputtypeId = dataTaskApplyPutputtypeCreate.recordset[0].RESULT;
        if(applyOutputtypeId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
        }
      }
    }
    const price_apply_reviewlevel = apiHelper.getValueFromObject(bodyParams, 'list_price_apply_reviewlevel');
    if(price_apply_reviewlevel && price_apply_reviewlevel.length > 0)
    {
      for(let i = 0;i < price_apply_reviewlevel.length;i++) {
        const item2 = price_apply_reviewlevel[i];
        const requestApplyReviewLevelCreate = new sql.Request(transaction);
        const dataTaskApplyReviewLevelCreate = await requestApplyReviewLevelCreate // eslint-disable-line no-await-in-loop
          .input('PRICEID', priceId)
          .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item2, 'output_type_id'))
          .input('PRICEREVIEWLEVELID', apiHelper.getValueFromObject(item2, 'price_review_level_id'))
          .input('REVIEWUSER', apiHelper.getValueFromObject(item2, 'user_name'))
          .input('AUTOREVIEW', apiHelper.getValueFromObject(item2, 'auto_review'))
          .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_CREATEORUPDATE);
        const applyReviewLevelId = dataTaskApplyReviewLevelCreate.recordset[0].RESULT;
        if(applyReviewLevelId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
        }
      }
    }
    // Commit transaction
    await transaction.commit();

    return new ServiceResponse(true, RESPONSE_MSG.SL_PRICES.CREATE_SUCCESS, {
      'price_id': priceId,
    });
  } catch (e) {
    // Write log
    logger.error(e, {'function': 'priceService.createOrUpdatePrice'});

    // Rollback transaction
    transaction.rollback();

    return new ServiceResponse(false, e);
  }
};

const detailPrice = async (productId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTID', productId)
      .execute(PROCEDURE_NAME.SL_PRICES_GETBYPRODUCTID);

    let slPriceByProduct = data.recordsets[0];
    // If exists SL_PRICES

    let slPrice = PriceClass.detailProduct(slPriceByProduct[0]);
    slPrice.price_apply_outputtype = [];
    for (const item of slPriceByProduct) // danh sách prices lấy theo productid
    {
      // Lấy thoog tin hình thức xuất, giá,.. của 1 price
      let priceId = item.PRICEID;
      const dataPriceApplyOutputtype = await pool.request() // eslint-disable-line no-await-in-loop
        .input('PRICEID', priceId)
        .execute(PROCEDURE_NAME.SL_PRICES_GETBYID);
      let itemPrice = PriceClass.detailPrices(dataPriceApplyOutputtype.recordsets[0][0]);
      // lấy thông tin mức duyệt của htx
      itemPrice.list_price_apply_reviewlevel=[];
      const dataPriceApplyReviewlevel = await pool.request() // eslint-disable-line no-await-in-loop
        .input('PRICEID', priceId)
        .input('OUTPUTTYPEID', item.OUTPUTTYPEID)
        .execute(PROCEDURE_NAME.SL_PRICE_APPLY_OUTPUTTYPE_REVIEWLEVEL_GETLISTBYPRICEID);
      if(dataPriceApplyReviewlevel.recordsets && dataPriceApplyReviewlevel.recordsets.length > 0)
      {
        const listPriceApplyReviewLevel = PriceClass.listReviewlevel(dataPriceApplyReviewlevel.recordsets[0]);
        itemPrice.list_price_apply_reviewlevel=listPriceApplyReviewLevel;
      }
      // lấy danh sách khu vuc áp dụng
      itemPrice.list_area_apply=[];
      const dataAreaApply = await pool.request() // eslint-disable-line no-await-in-loop
        .input('PRICEID', priceId)
        .execute(PROCEDURE_NAME.SL_PRICE_GetListAreaByPriceID);
      if(dataAreaApply.recordsets && dataAreaApply.recordsets.length > 0)
      {
        const listArea = PriceClass.listArea(dataAreaApply.recordsets[0]);
        itemPrice.list_area_apply=listArea;
      }
      // lấy danh sách cơ sở áp dụng theo giá
      itemPrice.list_business_apply=[];
      const dataBusinessApply = await pool.request() // eslint-disable-line no-await-in-loop
        .input('PRICEID', priceId)
        .execute(PROCEDURE_NAME.SL_PRICE_GetListBusinessByPriceID);
      if(dataBusinessApply.recordsets && dataBusinessApply.recordsets.length > 0)
      {
        const listBusiness = PriceClass.listBusiness(dataBusinessApply.recordsets[0]);
        itemPrice.list_business_apply=listBusiness;
      }
      slPrice.price_apply_outputtype.push(itemPrice);
    }
    return new ServiceResponse(true, '', slPrice);
  } catch (e) {
    logger.error(e, {'function': 'priceService.detailPrice'});

    return new ServiceResponse(false, e.message);
  }
};

const deletePrice = async (dataDelete = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    // Delete SL_PRICES
    const requestPrice = new sql.Request(transaction);
    const resultPrice = await requestPrice
      .input('PRICEID', apiHelper.getValueFromObject(dataDelete, 'price_id'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(dataDelete, 'user_name'))
      .execute(PROCEDURE_NAME.SL_PRICES_DELETE);
    // If store can not delete data
    if (resultPrice.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.SL_PRICES.DELETE_FAILED);
    }
    // Delete SL_PRICES_APPLY_OUTPUTTYPE
    const requestPriceoutputtypeDelete = new sql.Request(transaction);
    const resultPriceOutputtypeDelete = await requestPriceoutputtypeDelete
      .input('PRICEID', apiHelper.getValueFromObject(dataDelete, 'price_id'))
      .execute(PROCEDURE_NAME.SL_PRICE_APPLY_BUSINESS_OUTPUTTYPE_BUSINESS_DELETE);
    // If store can not delete data
    if (resultPriceOutputtypeDelete.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.SL_PRICES.DELETE_FAILED);
    }
    // Delete SL_PRICES_APPLY_REVIEWLEVEL
    const requestPriceReviewLevelDelete = new sql.Request(transaction);
    const resultPriceReviewLevelDelete = await requestPriceReviewLevelDelete
      .input('PRICEID', apiHelper.getValueFromObject(dataDelete, 'price_id'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(dataDelete, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_DELETE);
    // If store can not delete data
    if (resultPriceReviewLevelDelete.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.SL_PRICES.DELETE_FAILED);
    }
    // Commit transaction
    await transaction.commit();

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'priceService.deletePrice'});

    // Rollback transaction
    await transaction.rollback();

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusPrice = async (dataUpdate = {}) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PRICEID', apiHelper.getValueFromObject(dataUpdate, 'price_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(dataUpdate, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(dataUpdate, 'user_name'))
      .execute(PROCEDURE_NAME.SL_PRICES_UPDATESTATUS);

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'priceService.changeStatusPrice'});

    return new ServiceResponse(false, e);
  }
};

const approvedPriceReviewList = async (bodyParams = {}) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('PRICEAPPLYREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'price_apply_review_level_id'))
      .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
      .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
      .input('USERNAME', bodyParams.auth_name)
      .execute(PROCEDURE_NAME.SL_PRICES_APPROVE);
    let result = data.recordset[0].RESULT;
    switch (result) {
      case 1:
        return new ServiceResponse(true, RESPONSE_MSG.SL_PRICES.APPROVE_SUCCESS);
      case 0:
        return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_EXITST);
      case -1:
        return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_NOTEXITST);
      default:
        return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_UNNOW);
    }

  } catch (e) {
    logger.error(e, {'function': 'priceService.approvedPriceReviewList'});

    return new ServiceResponse(false, e.message);
  }
};

const getListPriceReviewLVUser = async (output_type_id) => {
  try {
    let price_review_lv_users = [];
    const pool = await mssql.pool;
    const dataPriceReviewLVUser = await pool.request()
      .input('OUTPUTTYPEID', output_type_id)
      .execute(PROCEDURE_NAME.SL_PRICE_REVIEW_LV_USER_GETBYOUTPUTTYPE);
    if (dataPriceReviewLVUser.recordset && dataPriceReviewLVUser.recordset.length > 0) {
      let dataRaw = outputTypeClass.listPriceReviewLVUser(dataPriceReviewLVUser.recordset);
      const dataPriceReviewLevel = _.chain(dataRaw)
        .groupBy('price_review_level_id')
        .map((value, key) => ({
          price_review_level_id: key,
          data: value,
        }))
        .value();
      for (const value of dataPriceReviewLevel) {
        let price_review_level = value.data[0];
        price_review_level.users = [];
        for (const value2 of value.data) {
          price_review_level.users.push({
            user_name: value2.user_name,
            user_full_name: value2.user_full_name,
          });
        }
        price_review_level = removeKeyFromObject(price_review_level, ['user_name', 'user_full_name',
          'product_category_id', 'product_category_name',
        ]);
        price_review_lv_users.push(price_review_level);
      }
    }
    return new ServiceResponse(true, '', price_review_lv_users);
  } catch (e) {
    logger.error(e, {'function': 'priceService.getListPriceReviewLVUser'});

    return new ServiceResponse(true, '', {});
  }
};
const removeKeyFromObject = (data = {}, propRemove = []) => {
  return Object.keys(data).reduce((object, key) => {
    if (!propRemove.includes(key)) {
      object[key] = data[key];
    }
    return object;
  }, {});
};

const listAreaByOutputType = async (queryParams = {}) => {
  try {
    const outPutTypeId= apiHelper.getValueFromObject(queryParams, 'output_type_id');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('OUTPUTTYPEID', outPutTypeId)
      .execute(PROCEDURE_NAME.SL_OUTPUT_AREA_GetListByOutputTypeID);
    let datas = data.recordsets[0];
    return new ServiceResponse(true, '',
      {
        'data': PriceClass.listArea(datas),
      });
  } catch (e) {
    logger.error(e, {'function': 'priceService.listAreaByOutputType'});

    return new ServiceResponse(false, e.message);
  }
};

const listBussinessByArea = async (queryParams = {}) => {
  try {
    const areaId= apiHelper.getValueFromObject(queryParams, 'area_id');
    const companyId= apiHelper.getValueFromObject(queryParams, 'company_id');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('AREAID', areaId)
      .input('COMPANYID', companyId)
      .execute(PROCEDURE_NAME.AM_BUSSINESS_GetListByAreaID);
    let datas = data.recordsets[0];
    return new ServiceResponse(true, '',
      {
        'data':PriceClass.listBusiness(datas),
      });
  } catch (e) {
    logger.error(e, {'function': 'priceService.listBussinessByArea'});

    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListPrice,
  createPrice,
  detailPrice,
  updatePrice,
  deletePrice,
  changeStatusPrice,
  approvedPriceReviewList,
  getListPriceReviewLVUser,
  listAreaByOutputType,
  listBussinessByArea,
};
