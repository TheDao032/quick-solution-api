const promotionService = require('./promotion.service');
const promotionApplyProductService = require('../promotion_apply_product/promotion_apply_product.service');
const promotionOfferApplyService = require('../promotion_offer_apply/promotion_offer_apply.service');
const promotionCustomerTypeService = require('../promotion_customer_type/promotion_customer_type.service');
const promotionCompanyService = require('../promotion_company/promotion_company.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list CRM_SEGMENT
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await promotionService.getListPromotion(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    if(data && apiHelper.getValueFromObject(req.query, 'get_offer') ==='1')
    {
      for(let i = 0;i < data.length;i++) {
        const item = data[i];
        // eslint-disable-next-line no-await-in-loop
        const serviceRes2 = await promotionOfferApplyService.getListByPromotionId(item.promotion_id);
        if(serviceRes2.isFailed()) {
          return next(serviceRes2);
        }
        item.list_offer = serviceRes2.getData();
      }
    }
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_SEGMENT
 */
const detail = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await promotionService.detail(req.params.promotionId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const serviceRes1 = await promotionApplyProductService.getListByPromotionId(req.params.promotionId);
    if(serviceRes1.isFailed()) {
      return next(serviceRes1);
    }
    const serviceRes2 = await promotionOfferApplyService.getListByPromotionId(req.params.promotionId);
    if(serviceRes2.isFailed()) {
      return next(serviceRes2);
    }
    const serviceRes3 = await promotionCustomerTypeService.getListByPromotionId(req.params.promotionId);
    if(serviceRes3.isFailed()) {
      return next(serviceRes3);
    }
    const serviceRes4 = await promotionCompanyService.getListByPromotionId(req.params.promotionId);
    if(serviceRes4.isFailed()) {
      return next(serviceRes3);
    }
    let datatemp = serviceRes.getData();
    datatemp.list_apply_product = serviceRes1.getData();
    datatemp.list_offer_apply = serviceRes2.getData();
    datatemp.list_customer_type = serviceRes3.getData();
    datatemp.list_company = serviceRes4.getData();
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_AREA
 */
const createPromotion = async (req, res, next) => {
  try {
    req.body.promotion_id = null;
    const serviceRes = await promotionService.createPromotionOrUpdates(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PROMOTION.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a MD_AREA
 */
const updatePromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.promotionId;
    req.body.promotion_id = promotionId;

    // Check segment exists
    const serviceResDetail = await promotionService.detail(promotionId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await promotionService.createPromotionOrUpdates(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PROMOTION.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status MD_AREA
 */
const changeStatusPromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.promotionId;

    // Check userGroup exists
    const serviceResDetail = await promotionService.detail(promotionId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await promotionService.changeStatusPromotion(promotionId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.PROMOTION.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const approvePromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.promotionId;

    // Check userGroup exists
    const serviceResDetail = await promotionService.detail(promotionId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await promotionService.approvePromotion(promotionId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.PROMOTION.APPROVE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deletePromotion = async (req, res, next) => {
  try {
    const id = req.params.promotionId;

    // Check area exists
    const serviceResDetail = await promotionService.detail(id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await promotionService.deletePromotion(id, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PROMOTION.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
  detail,
  createPromotion,
  updatePromotion,
  changeStatusPromotion,
  approvePromotion,
  deletePromotion,
};
