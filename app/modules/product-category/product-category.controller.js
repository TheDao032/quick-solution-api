const productCategoryService = require('./product-category.service');
const taskWorkFollowService = require('../task-work-follow/task-work-follow.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list CRM_SEGMENT
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await productCategoryService.getListProductCategory(req.query);
    const {data, total, page, limit} = serviceRes.getData();
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
    const serviceRes = await productCategoryService.detail(req.params.productCategoryId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const serviceRes1 = await productCategoryService.getListAttributeByCategory(req.params.productCategoryId);
    if(serviceRes1.isFailed()) {
      return next(serviceRes1);
    }
    let datatemp = serviceRes.getData();
    datatemp.list_attribute = serviceRes1.getData();

    return res.json(new SingleResponse(datatemp));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_AREA
 */
const createProductCategory= async (req, res, next) => {
  try {
    req.body.product_category_id = null;
    const serviceRes = await productCategoryService.createProductCategoryOrUpdates(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PRODUCTCATEGORY.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a MD_AREA
 */
const updateProductCategory = async (req, res, next) => {
  try {
    const productCategoryId = req.params.productCategoryId;
    req.body.product_category_id = productCategoryId;

    // Check segment exists
    const serviceResDetail = await productCategoryService.detail(productCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await productCategoryService.createProductCategoryOrUpdates(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PRODUCTCATEGORY.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status MD_AREA
 */
const changeStatusProductCategory = async (req, res, next) => {
  try {
    const productCategoryId = req.params.productCategoryId;

    // Check userGroup exists
    const serviceResDetail = await productCategoryService.detail(productCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await productCategoryService.changeStatusProductCategory(productCategoryId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.PRODUCTCATEGORY.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteProductCategory = async (req, res, next) => {
  try {
    const productCategoryId = req.params.productCategoryId;

    // Check area exists
    const serviceResDetail = await productCategoryService.detail(productCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await productCategoryService.deleteProductCategory(productCategoryId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PRODUCTCATEGORY.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_PRODUCTCATEGORY', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
const getOptionForList = async (req, res, next) => {
  try {
    req.query.user_groups=req.auth.user_groups;
    req.query.isAdministrator =req.auth.isAdministrator;
    const typeFuctions = ['EDITFUNCTIONID','DELETEFUNCTIONID'];
    const serviceRes = await productCategoryService.getOptionsAll(typeFuctions,req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptionForCreate = async (req, res, next) => {
  try {
    req.query.isAdministrator =req.auth.isAdministrator;
    req.query.user_groups=req.auth.user_groups;
    const typeFuctions = ['ADDFUNCTIONID'];
    const serviceRes = await productCategoryService.getOptionsAll(typeFuctions,req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getList,
  detail,
  createProductCategory,
  updateProductCategory,
  changeStatusProductCategory,
  deleteProductCategory,
  getOptions,
  getOptionForList,
  getOptionForCreate,
};
