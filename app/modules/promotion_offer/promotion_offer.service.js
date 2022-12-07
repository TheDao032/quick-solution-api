const promotionOfferClass = require('../promotion_offer/promotion_offer.class');
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
const folderNameImg = 'promotion';
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');
/**
 * Get list SM_PROMOTIONOFFER
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListPromotionOffer = async (queryParams = {}) => {
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
      .input('OFFERTYPE', apiHelper.getValueFromObject(queryParams, 'offer_type'))
      .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_GETLIST);

    const promotions = data.recordset;

    return new ServiceResponse(true, '', {
      'data': promotionOfferClass.list(promotions),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(promotions),
    });
  } catch (e) {
    logger.error(e, {'function': 'promotionOfferService.getListPromotionOffer'});
    return new ServiceResponse(true, '', {});
  }
};

const detailOffer = async (promotionOfferId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PROMOTIONOFFERID', promotionOfferId)
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_GETBYID);
    let promotionOffer = data.recordset;
    // If exists SM_PROMOTIONOFFRT
    if (promotionOffer && promotionOffer.length>0) {
      promotionOffer = promotionOfferClass.detail(promotionOffer[0]);
      return new ServiceResponse(true, '', promotionOffer);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'promotionOfferService.detailOffer'});
    return new ServiceResponse(false, e.message);
  }
};

const getListGiftByPromotionOfferId = async (promotionOfferId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PROMOTIONOFFERID', promotionOfferId)
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_GIFT_GETLIST);

    const promotionOfferGift = data.recordset;

    return new ServiceResponse(true, '', promotionOfferClass.listGift(promotionOfferGift));
  } catch (e) {
    logger.error(e, {'function': 'promotionOfferService.getListGiftByPromotionOfferId'});
    return new ServiceResponse(true, '', {});
  }
};
// Create SM_PROMOTIONOFFER
const createPromotionOfferOrUpdate = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
    const id = apiHelper.getValueFromObject(bodyParams, 'promotion_offer_id');
    // check used
    if(id && id !== '')
    {
      const requestPromotionCheckUsed = new sql.Request(transaction);
      const data = await requestPromotionCheckUsed
        .input('PROMOTIONOFFERID', id)
        .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_CHECKUSED);
      let used = promotionOfferClass.detailUsed(data.recordset);
      if (used[0].result===1) { // used
        return new ServiceResponse(false, 'Không thể chỉnh sửa ưu đãi này đang sử dụng bởi '+used[0].table_used, null);
      }
    }
    // create table tasktype
    const requestPromotionOfferCreate = new sql.Request(transaction);

    const dataPromotionOfferCreate = await requestPromotionOfferCreate
      .input('PROMOTIONOFFERID', apiHelper.getValueFromObject(bodyParams, 'promotion_offer_id'))
      .input('PROMOTIONOFFERNAME', apiHelper.getValueFromObject(bodyParams, 'promotion_offer_name'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .input('CONDITIONCONTENT', apiHelper.getValueFromObject(bodyParams, 'condition_content'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISPERCENTDISCOUNT',apiHelper.getValueFromObject(bodyParams, 'is_percent_discount'))
      .input('ISDISCOUNTBYSETPRICE', apiHelper.getValueFromObject(bodyParams, 'is_discount_by_set_price'))
      .input('ISFIXEDGIFT', apiHelper.getValueFromObject(bodyParams, 'is_fixed_gift'))
      .input('ISFIXPRICE', apiHelper.getValueFromObject(bodyParams, 'is_fix_price'))
      .input('DISCOUNTVALUE', apiHelper.getValueFromObject(bodyParams, 'discountvalue'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER',auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_CREATEORUPDATE);
    const promotionOfferId = dataPromotionOfferCreate.recordset[0].RESULT;
    if(promotionOfferId <= 0)
    {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTIONOFFER.CREATE_FAILED);
    }
    // check update
    if(id && id !== '')
    {
      // remove table map SM_PROMOTIONOFFER_GIFT
      const requestPromotionOGDelete = new sql.Request(transaction);
      const dataPromotionOGDelete = await requestPromotionOGDelete
        .input('PROMOTIONOFFERID', id)
        .input('UPDATEDUSER', auth_name)
        .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_GIFT_DELETEPROMOTIONOFFERID);
      const resultPromotionOGDelete = dataPromotionOGDelete.recordset[0].RESULT;
      if (resultPromotionOGDelete <= 0) {
        return new ServiceResponse(false,RESPONSE_MSG.PROMOTIONOFFER.UPDATE_FAILED);
      }
    }
    // create table SM_PROMOTIONOFFER_GIFT
    const list_offer_gifts = apiHelper.getValueFromObject(bodyParams, 'list_offer_gifts');
    if(list_offer_gifts && list_offer_gifts.length > 0)
    {
      for(let i = 0;i < list_offer_gifts.length;i++) {
        const item = list_offer_gifts[i];
        const requestPromotionOGCreate = new sql.Request(transaction);
        const dataPromotionOGCreate = await requestPromotionOGCreate // eslint-disable-line no-await-in-loop
          .input('PROMOTIONOFFERID', promotionOfferId)
          .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
          .input('CREATEDUSER', auth_name)
          .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_GIFT_CREATE);
        const taskPromotionOGId = dataPromotionOGCreate.recordset[0].RESULT;
        if(taskPromotionOGId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.PROMOTIONOFFER.CREATE_FAILED);
        }
      }
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true,'',promotionOfferId);
  } catch (e) {
    logger.error(e, {'function': 'promotionOfferService.createPromotionOfferOrUpdates'});
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

const changeStatusPromotionOffer = async (promotionOfferId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PROMOTIONOFFERID', promotionOfferId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'promotionOfferService.changeStatusPromotionOffer'});
    return new ServiceResponse(false);
  }
};

const deletePromotionOffer = async (promotionOfferId, bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
  await transaction.begin();
  try {
    // check used 
    const requestPromotionCheckUsed = new sql.Request(transaction);
    const data = await requestPromotionCheckUsed
      .input('PROMOTIONOFFERID', promotionOfferId)
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_CHECKUSED);
    let used = promotionOfferClass.detailUsed(data.recordset);
    if (used[0].result===1) { // used
      return new ServiceResponse(false, 'Không thể xóa, ưu đãi này đang sử dụng bởi '+used[0].table_used, null);
    }

    // remove table map SM_PROMOTIONOFFER_GIFT
    const requestPromotionOGDelete = new sql.Request(transaction);
    const dataPromotionOGDelete = await requestPromotionOGDelete
      .input('PROMOTIONOFFERID', promotionOfferId)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_GIFT_DELETEPROMOTIONOFFERID);
    const resultPromotionOGDelete = dataPromotionOGDelete.recordset[0].RESULT;
    if (resultPromotionOGDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTIONOFFER.DELETE_FAILED);
    }

    // remove table map SM_PROMOTIONOFFER
    const requestPromotionOfferDelete = new sql.Request(transaction);
    const dataPromotionOfferDelete = await requestPromotionOfferDelete
      .input('PROMOTIONOFFERID', promotionOfferId)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_DELETE);
    const resultPromotionOfferDelete = dataPromotionOfferDelete.recordset[0].RESULT;
    if (resultPromotionOfferDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTIONOFFER.DELETE_FAILED);
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true, RESPONSE_MSG.PROMOTIONOFFER.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'promotionOfferService.deletePromotionOffer'});
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};


const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

module.exports = {
  getListPromotionOffer,
  detailOffer,
  getListGiftByPromotionOfferId,
  createPromotionOfferOrUpdate,
  changeStatusPromotionOffer,
  deletePromotionOffer,
};
