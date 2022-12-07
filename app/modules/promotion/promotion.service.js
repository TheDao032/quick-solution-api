const promotionClass = require('../promotion/promotion.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const _ = require('lodash');
const folderNameImg = 'promotion';
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListPromotion = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('BEGINDATE', apiHelper.getValueFromObject(queryParams, 'begin_date'))
      .input('ENDDATE', apiHelper.getValueFromObject(queryParams, 'end_date'))
      .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
      .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
      .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
      .execute(PROCEDURE_NAME.SM_PROMOTION_GETLIST);

    const promotions = data.recordset;

    return new ServiceResponse(true, '', {
      'data': promotionClass.list(promotions),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(promotions),
    });
  } catch (e) {
    logger.error(e, {'function': 'promotionService.getListPromotion'});
    return new ServiceResponse(true, '', {});
  }
};

const detail = async (promotionId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PROMOTIONID', promotionId)
      .execute(PROCEDURE_NAME.SM_PROMOTION_GETBYID);
    let promotion = data.recordset;
    // If exists MD_AREA
    if (promotion && promotion.length>0) {
      promotion = promotionClass.detail(promotion[0]);
      return new ServiceResponse(true, '', promotion);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'promotionService.detail'});
    return new ServiceResponse(false, e.message);
  }
};

const saveImg = async (base64) => {
  let avatarIcon = null;

  try {
    if(fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const d = new Date();
      const nameFile = String(d.getDay().toString())+d.getMonth().toString()+d.getFullYear().toString()+d.getHours().toString()+d.getMinutes().toString()+d.getSeconds().toString()+d.getMilliseconds().toString();
      avatarIcon = await fileHelper.saveBase64(folderNameImg, base64, `${nameFile}.${extension}`);
    } else {
      avatarIcon = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {'function': 'promotionService.saveImg'});

    return avatarIcon;
  }
  return avatarIcon;
};

// Create TaskType
const createPromotionOrUpdates = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
    const url_banner=apiHelper.getValueFromObject(bodyParams, 'url_banner');
    const url_image_promotion= apiHelper.getValueFromObject(bodyParams, 'url_image_promotion');
    const pathUrlBanner = url_banner!==null && url_banner!==''? await saveImg(apiHelper.getValueFromObject(bodyParams, 'url_banner')):'';
    const pathUrlImagePromotion = url_image_promotion!==null && url_image_promotion!==''?await saveImg(apiHelper.getValueFromObject(bodyParams, 'url_image_promotion')):'';
    // create table tasktype
    const requestPromotionCreate = new sql.Request(transaction);
    const dataPromotionCreate = await requestPromotionCreate
      .input('PROMOTIONID', apiHelper.getValueFromObject(bodyParams, 'promotion_id'))
      .input('PROMOTIONNAME', apiHelper.getValueFromObject(bodyParams, 'promotion_name'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description'))
      .input('URLBANNER',pathUrlBanner)
      .input('BEGINDATE', apiHelper.getValueFromObject(bodyParams, 'begin_date'))
      .input('ISPROMOTIONCUSTOMERTYPE', apiHelper.getValueFromObject(bodyParams, 'is_promotion_customer_type'))
      .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
      .input('ISPROMOTIONBYPRICE', apiHelper.getValueFromObject(bodyParams, 'is_promotion_by_price'))
      .input('FROMPRICE', apiHelper.getValueFromObject(bodyParams, 'from_price'))
      .input('TOPRICE', apiHelper.getValueFromObject(bodyParams, 'to_price'))
      .input('ISAPPLYWITHORDERPROMOTION', apiHelper.getValueFromObject(bodyParams, 'is_apply_with_order_promotion'))
      .input('ISPROMOTIONBYTOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'is_promotion_by_total_money'))
      .input('STARTHOURS', apiHelper.getValueFromObject(bodyParams, 'start_hours'))
      .input('ENDHOURS', apiHelper.getValueFromObject(bodyParams, 'end_hours'))
      .input('MINPROMOTIONTOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'min_promotion_total_money'))
      .input('MAXPROMOTIONTOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'max_promotion_total_money'))
      .input('ISPROMOTIONBYTOTALQUANTITY', apiHelper.getValueFromObject(bodyParams, 'is_promorion_by_total_quantity'))
      .input('MINPROMOTIONTOTALQUANTITY', apiHelper.getValueFromObject(bodyParams, 'min_promotion_total_quantity'))
      .input('MAXPROMOTIONTOTALQUANTITY', apiHelper.getValueFromObject(bodyParams, 'max_promotion_total_quantity'))
      .input('ISLIMITPROMOTIONTIMES', apiHelper.getValueFromObject(bodyParams, 'is_limit_promotion_times'))
      .input('MAXPROMOTIONTIMES', apiHelper.getValueFromObject(bodyParams, 'max_promotion_times'))
      .input('URLIMAGEPROMOTION', pathUrlImagePromotion)
      .input('ISAPPLYHOURS', apiHelper.getValueFromObject(bodyParams, 'is_apply_hours'))
      .input('ISAPPLYSUN', apiHelper.getValueFromObject(bodyParams, 'is_apply_sun'))
      .input('ISAPPLYMON', apiHelper.getValueFromObject(bodyParams, 'is_apply_mon'))
      .input('ISAPPLYTU', apiHelper.getValueFromObject(bodyParams, 'is_apply_tu'))
      .input('ISAPPLYWE', apiHelper.getValueFromObject(bodyParams, 'is_apply_we'))
      .input('ISAPPLYTH', apiHelper.getValueFromObject(bodyParams, 'is_apply_th'))
      .input('ISAPPLYFR', apiHelper.getValueFromObject(bodyParams, 'is_apply_fr'))
      .input('ISAPPLYSA', apiHelper.getValueFromObject(bodyParams, 'is_apply_sa'))
      .input('ISCOMBOPROMOTION', apiHelper.getValueFromObject(bodyParams, 'is_combo_promotion'))
      .input('ISREWARDPOINT', apiHelper.getValueFromObject(bodyParams, 'is_reward_point'))
      .input('USERREVIEW', apiHelper.getValueFromObject(bodyParams, 'user_review'))
      .input('NOTEREVIEW', apiHelper.getValueFromObject(bodyParams, 'note_review'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER',auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTION_CREATEORUPDATE);
    const promotionId = dataPromotionCreate.recordset[0].RESULT;
    if(promotionId <= 0)
    {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.CREATE_FAILED);
    }
    // check update
    const id = apiHelper.getValueFromObject(bodyParams, 'promotion_id');
    if(id && id !== '')
    {
      // remove table map SM_PROMOTIONAPPLY_PRODUCT
      const requestPromotionProductDelete = new sql.Request(transaction);
      const dataPromotionProductDelete = await requestPromotionProductDelete
        .input('PROMOTIONID', id)
        .input('UPDATEDUSER', auth_name)
        .execute(PROCEDURE_NAME.SM_PROMOTIONAPPLY_PRODUCT_DELETEBYPROMOTIONID);
      const resultPromotionProductDelete = dataPromotionProductDelete.recordset[0].RESULT;
      if (resultPromotionProductDelete <= 0) {
        return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.UPDATE_FAILED);
      }

      // remove table map SM_PROMOTIONOFFER_APPLY
      const requestPromotionOfferDelete = new sql.Request(transaction);
      const dataPromotionOfferDelete = await requestPromotionOfferDelete
        .input('PROMOTIONID', promotionId)
        .input('UPDATEDUSER', auth_name)
        .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_APPLY_DELETEBYPROMOTIONID);
      const resultPromotionOfferDelete = dataPromotionOfferDelete.recordset[0].RESULT;
      if (resultPromotionOfferDelete <= 0) {
        return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.UPDATE_FAILED);
      }

      // remove table map SM_PROMOTION_CUSTOMER
      const requestPromotionCustomerDelete = new sql.Request(transaction);
      const dataPromotionCustomerDelete = await requestPromotionCustomerDelete
        .input('PROMOTIONID', promotionId)
        .input('UPDATEDUSER', auth_name)
        .execute(PROCEDURE_NAME.SM_PROMOTION_CUSTOMERTYPE_DELETEBYPROMOTIONID);
      const resultPromotionCustomerDelete = dataPromotionCustomerDelete.recordset[0].RESULT;
      if (resultPromotionCustomerDelete <= 0) {
        return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.UPDATE_FAILED);
      }
      // remove table map SM_PROMOTION_COMPANY
      const requestPromotionCompanyDelete = new sql.Request(transaction);
      const dataPromotionCompanyDelete = await requestPromotionCompanyDelete
        .input('PROMOTIONID', promotionId)
        .input('UPDATEDUSER', auth_name)
        .execute(PROCEDURE_NAME.SM_PROMOTION_COMPANY_DELETEBYPROMOTIONID);
      const resultPromotionCompanyDelete = dataPromotionCompanyDelete.recordset[0].RESULT;
      if (resultPromotionCompanyDelete <= 0) {
        return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.UPDATE_FAILED);
      }
    }
    // create table SM_PROMOTIONAPPLY_PRODUCT
    const list_apply_product = apiHelper.getValueFromObject(bodyParams, 'list_apply_product');
    if(list_apply_product && list_apply_product.length > 0)
    {
      for(let i = 0;i < list_apply_product.length;i++) {
        const item = list_apply_product[i];
        const requestPromotionAPCreate = new sql.Request(transaction);
        const dataPromotionAPCreate = await requestPromotionAPCreate // eslint-disable-line no-await-in-loop
          .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
          .input('PROMOTIONID', promotionId)
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
          .input('CREATEDUSER', auth_name)
          .execute(PROCEDURE_NAME.SM_PROMOTIONAPPLY_PRODUCT_CREATE);
        const taskPromotionAPId = dataPromotionAPCreate.recordset[0].RESULT;
        if(taskPromotionAPId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.CREATE_FAILED);
        }
      }
    }

    // create table SM_PROMOTIONOFFER_APPLY
    const list_offer_apply = apiHelper.getValueFromObject(bodyParams, 'list_offer_apply');
    if(list_offer_apply && list_offer_apply.length > 0)
    {
      for(let i = 0;i < list_offer_apply.length;i++) {
        const item = list_offer_apply[i];
        const requestPromotionOACreate = new sql.Request(transaction);
        const dataPromotionOACreate = await requestPromotionOACreate // eslint-disable-line no-await-in-loop
          .input('PROMOTIONID', promotionId)
          .input('PROMOTIONOFFERID', apiHelper.getValueFromObject(item, 'promotion_offer_id'))
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
          .input('CREATEDUSER', auth_name)
          .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_APPLY_CREATE);
        const taskPromotionOAId = dataPromotionOACreate.recordset[0].RESULT;
        if(taskPromotionOAId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.CREATE_FAILED);
        }
      }
    }

    // create table SM_PROMOTION_CUSTOMERTYPE
    const list_customer_type = apiHelper.getValueFromObject(bodyParams, 'list_customer_type');
    if(list_customer_type && list_customer_type.length > 0)
    {
      for(let i = 0;i < list_customer_type.length;i++) {
        const item = list_customer_type[i];
        const requestPromotionCTCreate = new sql.Request(transaction);
        const dataPromotionCTCreate = await requestPromotionCTCreate // eslint-disable-line no-await-in-loop
          .input('PROMOTIONID', promotionId)
          .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
          .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(item, 'customer_type_id'))
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('CREATEDUSER', auth_name)
          .execute(PROCEDURE_NAME.SM_PROMOTION_CUSTOMERTYPE_CREATE);
        const taskPromotionCTId = dataPromotionCTCreate.recordset[0].RESULT;
        if(taskPromotionCTId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.CREATE_FAILED);
        }
      }
    }

    // create table SM_PROMOTION_COMPANY
    const list_company = apiHelper.getValueFromObject(bodyParams, 'list_company');
    if(list_company && list_company.length > 0)
    {
      for(let i = 0;i < list_company.length;i++) {
        const item = list_company[i];
        const requestPromotionCompanyCreate = new sql.Request(transaction);
        const dataPromotionCompanyCreate = await requestPromotionCompanyCreate // eslint-disable-line no-await-in-loop
          .input('COMPANYID', apiHelper.getValueFromObject(item, 'company_id'))
          .input('PROMOTIONID', promotionId)
          .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('CREATEDUSER', auth_name)
          .execute(PROCEDURE_NAME.SM_PROMOTION_COMPANY_CREATE);
        const taskPromotionCompanyId = dataPromotionCompanyCreate.recordset[0].RESULT;
        if(taskPromotionCompanyId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.CREATE_FAILED);
        }
      }
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true,'',promotionId);
  } catch (e) {
    logger.error(e, {'function': 'promotionService.createPromotionOrUpdates'});
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

const changeStatusPromotion = async (promotionId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PROMOTIONID', promotionId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SM_PROMOTION_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'promotionService.changeStatusPromotion'});

    return new ServiceResponse(false);
  }
};

const deletePromotion = async (promotionId, bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
  await transaction.begin();
  try {
    // check used 
    const requestPromotionCheckUsed = new sql.Request(transaction);
    const data = await requestPromotionCheckUsed
      .input('PROMOTIONID', promotionId)
      .execute(PROCEDURE_NAME.SM_PROMOTION_CHECKUSED);
    let used = promotionClass.detailUsed(data.recordset);
    if (used[0].result===1) { // used
      return new ServiceResponse(false, 'Không thể xóa, khuyến mãi này đang sử dụng bởi '+used[0].table_used, null);
    }

    // remove table map SM_PROMOTIONAPPLY_PRODUCT
    const requestPromotionProductDelete = new sql.Request(transaction);
    const dataPromotionProductDelete = await requestPromotionProductDelete
      .input('PROMOTIONID', promotionId)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTIONAPPLY_PRODUCT_DELETEBYPROMOTIONID);
    const resultPromotionProductDelete = dataPromotionProductDelete.recordset[0].RESULT;
    if (resultPromotionProductDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.DELETE_FAILED);
    }

    // remove table map SM_PROMOTIONOFFER_APPLY
    const requestPromotionOfferDelete = new sql.Request(transaction);
    const dataPromotionOfferDelete = await requestPromotionOfferDelete
      .input('PROMOTIONID', promotionId)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_APPLY_DELETEBYPROMOTIONID);
    const resultPromotionOfferDelete = dataPromotionOfferDelete.recordset[0].RESULT;
    if (resultPromotionOfferDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.DELETE_FAILED);
    }

    // remove table map SM_PROMOTION_CUSTOMER
    const requestPromotionCustomerDelete = new sql.Request(transaction);
    const dataPromotionCustomerDelete = await requestPromotionCustomerDelete
      .input('PROMOTIONID', promotionId)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTION_CUSTOMERTYPE_DELETEBYPROMOTIONID);
    const resultPromotionCustomerDelete = dataPromotionCustomerDelete.recordset[0].RESULT;
    if (resultPromotionCustomerDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.DELETE_FAILED);
    }

    // remove table map SM_PROMOTION_CUSTOMER
    const requestPromotionCompanyDelete = new sql.Request(transaction);
    const dataPromotionCompanyDelete = await requestPromotionCompanyDelete
      .input('PROMOTIONID', promotionId)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTION_COMPANY_DELETEBYPROMOTIONID);
    const resultPromotionCompanyDelete = dataPromotionCompanyDelete.recordset[0].RESULT;
    if (resultPromotionCompanyDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.DELETE_FAILED);
    }

    // remove table PROMOTION
    const requestPromotionDelete = new sql.Request(transaction);
    const dataPromotiondelete = await requestPromotionDelete
      .input('PROMOTIONID', promotionId)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.SM_PROMOTION_DELETE);
    const resultPromotionDelete = dataPromotiondelete.recordset[0].RESULT;
    if (resultPromotionDelete <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.PROMOTION.DELETE_FAILED);
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true, RESPONSE_MSG.PROMOTION.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'promotionService.deletePromotion'});
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};

const approvePromotion = async (promotionId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PROMOTIONID', promotionId)
      .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
      .input('NOTEREVIEW', apiHelper.getValueFromObject(bodyParams, 'note_review'))
      .input('USERREVIEW', apiHelper.getValueFromObject(bodyParams, 'user_review'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SM_PROMOTION_APPROVE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'promotionService.approvePromotion'});

    return new ServiceResponse(false);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

module.exports = {
  getListPromotion,
  detail,
  createPromotionOrUpdates,
  changeStatusPromotion,
  approvePromotion,
  deletePromotion,
};
