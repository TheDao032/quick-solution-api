const websiteCategoryService = require('./website-category.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list
 */
const getListWebsiteCategory = async (req, res, next) => {
  try {
    const serviceRes = await websiteCategoryService.getListWebsiteCategory(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list all MD_STORE
 */
const getListAllWebsiteCategory = async (req, res, next) => {
  try {
    const serviceRes = await websiteCategoryService.getListAllWebsiteCategory(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list all MD_STORE
 */
const getListAllWebsite = async (req, res, next) => {
  try {
    const serviceRes = await websiteCategoryService.getListAllWebsite(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list all MD_STORE
 */
const getListAllParent = async (req, res, next) => {
  try {
    const serviceRes = await websiteCategoryService.getListAllParent(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailWebsiteCategory = async (req, res, next) => {
  try {
    const serviceRes = await websiteCategoryService.detailWebsiteCategory(req.params.websiteCategoryId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const detailWebsite = async (req, res, next) => {
  try {
    const serviceRes = await websiteCategoryService.detailWebsite(req.params.websiteId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createWebsiteCategory= async (req, res, next) => {
  try {
    req.body.website_category_id = null;
    const serviceRes = await websiteCategoryService.createWebsiteCategoryOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.WEBSITECATEGORY.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateWebsiteCategory = async (req, res, next) => {
  try {
    const websiteCategoryId = req.params.websiteCategoryId;
    req.body.website_category_id = websiteCategoryId;

    const serviceResDetail = await websiteCategoryService.detailWebsiteCategory(websiteCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await websiteCategoryService.createWebsiteCategoryOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.WEBSITECATEGORY.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusWebsiteCategory = async (req, res, next) => {
  try {
    const websiteCategoryId = req.params.websiteCategoryId;

    const serviceResDetail = await websiteCategoryService.detailWebsiteCategory(websiteCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await websiteCategoryService.changeStatusWebsiteCategory(websiteCategoryId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.WEBSITECATEGORY.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Check parent
 */
const checkParent = async (req, res, next) => {
  try {
    const websiteCategoryId = req.params.websiteCategoryId;

    const serviceRes = await websiteCategoryService.checkParent(websiteCategoryId, req.body);
    if(serviceRes.isFailed()) {
      return res.json(new SingleResponse(0, RESPONSE_MSG.WEBSITECATEGORY.EXISTS_PARENT));
    }
    return res.json(new SingleResponse(1, null));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteWebsiteCategory = async (req, res, next) => {
  try {
    const websiteCategoryId = req.params.websiteCategoryId;

    const serviceResDetail = await websiteCategoryService.detailWebsiteCategory(websiteCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await websiteCategoryService.deleteWebsiteCategory(websiteCategoryId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.WEBSITECATEGORY.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListWebsiteCategory,
  detailWebsiteCategory,
  createWebsiteCategory,
  updateWebsiteCategory,
  deleteWebsiteCategory,
  changeStatusWebsiteCategory,
  getListAllWebsiteCategory,
  getListAllParent,
  getListAllWebsite,
  detailWebsite,
  checkParent,
};
