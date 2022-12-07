const staticContentService = require('./static-content.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_STORE
 */

const getListMetaTitle = async (req, res, next) => {
  try {
    const serviceRes = await staticContentService.getListMetaTitle(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const getListMetaKeyword = async (req, res, next) => {
  try {
    const serviceRes = await staticContentService.getListMetaKeyword(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const checkMetaTitle = async (req, res, next) => {
  try {
    const serviceRes = await staticContentService.checkMetaTitle(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null));
  } catch (error) {
    return next(error);
  }
};

const checkMetaKeyword = async (req, res, next) => {
  try {
    const serviceRes = await staticContentService.checkMetaKeyword(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null));
  } catch (error) {
    return next(error);
  }
};

const getListStaticContent = async (req, res, next) => {
  try {
    const serviceRes = await staticContentService.getListStaticContent(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail MD_STORE
 */
const detailStaticContent = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await staticContentService.detailStaticContent(req.params.staticContentId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_STORE
 */
const createStaticContent= async (req, res, next) => {
  try {
    req.body.static_content_id = null;
    const serviceRes = await staticContentService.createStaticContentOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STATICCONTENT.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a MD_STORE
 */
const updateStaticContent = async (req, res, next) => {
  try {
    const staticContentId = req.params.staticContentId;
    req.body.static_content_id = staticContentId;
    // Check segment exists
    const serviceResDetail = await staticContentService.detailStaticContent(staticContentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update segment
    const serviceRes = await staticContentService.createStaticContentOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STATICCONTENT.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status MD_STORE
 */
const changeStatusStaticContent = async (req, res, next) => {
  try {
    const staticContentId = req.params.staticContentId;

    // Check userGroup exists
    const serviceResDetail = await staticContentService.detailStaticContent(staticContentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await staticContentService.changeStatusStaticContent(staticContentId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.STATICCONTENT.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteStaticContent = async (req, res, next) => {
  try {
    const staticContentId = req.params.staticContentId;

    // Check area exists
    const serviceResDetail = await staticContentService.detailStaticContent(staticContentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await staticContentService.deleteStaticContent(staticContentId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.STATICCONTENT.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListStaticContent,
  detailStaticContent,
  createStaticContent,
  updateStaticContent,
  changeStatusStaticContent,
  deleteStaticContent,
  getListMetaTitle,
  getListMetaKeyword,
  checkMetaTitle,
  checkMetaKeyword,
};
