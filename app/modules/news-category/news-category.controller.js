const newsCategoryService = require('./news-category.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_STORE
 */
const getListNewsCategory = async (req, res, next) => {
  try {
    const serviceRes = await newsCategoryService.getListNewsCategory(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list all MD_STORE
 */
const getListAllNewsCategory = async (req, res, next) => {
  try {
    const serviceRes = await newsCategoryService.getListAllNewsCategory(req.params.newsCategoryId);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};


/**
 * Get detail MD_STORE
 */
const detailNewsCategory = async (req, res, next) => {
  try {
    const serviceRes = await newsCategoryService.detailNewsCategory(req.params.newsCategoryId);
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
const createNewsCategory= async (req, res, next) => {
  try {
    req.body.news_category_id = null;
    const serviceRes = await newsCategoryService.createNewsCategoryOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWSCATEGORY.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateNewsCategory = async (req, res, next) => {
  try {
    const newsCategoryId = req.params.newsCategoryId;
    req.body.news_category_id = newsCategoryId;

    const serviceResDetail = await newsCategoryService.detailNewsCategory(newsCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await newsCategoryService.createNewsCategoryOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWSCATEGORY.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusNewsCategory = async (req, res, next) => {
  try {
    const newsCategoryId = req.params.newsCategoryId;

    const serviceResDetail = await newsCategoryService.detailNewsCategory(newsCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await newsCategoryService.changeStatusNewsCategory(newsCategoryId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.NEWSCATEGORY.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


/**
 * Delete
 */
const deleteNewsCategory = async (req, res, next) => {
  try {
    const newsCategoryId = req.params.newsCategoryId;

    const serviceResDetail = await newsCategoryService.detailNewsCategory(newsCategoryId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await newsCategoryService.deleteNewsCategory(newsCategoryId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.NEWSCATEGORY.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const checkOrderIndexNewsCategory = async (req, res, next) => {
  try {
    const serviceRes = await newsCategoryService.checkOrderIndexNewsCategory(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null));
  } catch (error) {
    return next(error);
  }
};

/**
 * Check parent
 */
const checkParent = async (req, res, next) => {
  try {
    const newsCategoryId = req.params.newsCategoryId;

    const serviceRes = await newsCategoryService.checkParent(newsCategoryId, req.body);
    if(serviceRes.isFailed()) {
      return res.json(new SingleResponse(0, RESPONSE_MSG.NEWSCATEGORY.EXISTS_PARENT));
    }
    return res.json(new SingleResponse(1, null));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListNewsCategory,
  detailNewsCategory,
  createNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
  changeStatusNewsCategory,
  getListAllNewsCategory,
  checkOrderIndexNewsCategory,
  checkParent,
};
