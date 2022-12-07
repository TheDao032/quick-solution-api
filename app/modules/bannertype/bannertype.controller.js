const bannertypeService = require('./bannertype.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list
 */
const getListBannerType = async (req, res, next) => {
  try {
    const serviceRes = await bannertypeService.getListBannerType(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailBannerType = async (req, res, next) => {
  try {
    const serviceRes = await bannertypeService.detailBannerType(req.params.banner_type_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
/**
 * Create new a 
 */
const createBannerType = async (req, res, next) => {
  try {
    req.body.banner_type_id = null;
    const serviceRes = await bannertypeService.createBannerTypeOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BANNERTYPE.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a 
 */
const updateBannerType = async (req, res, next) => {
  try {
    const banner_type_id = req.params.banner_type_id;
    req.body.banner_type_id = banner_type_id;

    // Check exists
    const serviceResDetail = await bannertypeService.detailBannerType(banner_type_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes = await bannertypeService.createBannerTypeOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BANNERTYPE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status 
 */
const changeStatusBannerType = async (req, res, next) => {
  try {
    const banner_type_id = req.params.banner_type_id;

    // Check exists
    const serviceResDetail = await bannertypeService.detailBannerType(banner_type_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await bannertypeService.changeStatusBannerType(banner_type_id, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.BANNERTYPE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
/**
 * Delete
 */
const deleteBannerType = async (req, res, next) => {
  try {
    const banner_type_id = req.params.banner_type_id;

    // Check area exists
    const serviceResDetail = await bannertypeService.detailBannerType(banner_type_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await bannertypeService.deleteBannerType(banner_type_id, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.SUPPORT.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Check parent
 */
const checkParent = async (req, res, next) => {
  try {
    const banner_type_id = req.params.banner_type_id;

    const serviceRes = await bannertypeService.checkParent(banner_type_id, req.body);
    if(serviceRes.isFailed()) {
      return res.json(new SingleResponse(0, RESPONSE_MSG.BANNERTYPE.EXISTS_PARENT));
    }
    return res.json(new SingleResponse(1, null));
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
    const serviceRes = await optionService('CMS_BANNERTYPE', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getListBannerType,
  detailBannerType,
  deleteBannerType,
  changeStatusBannerType,
  createBannerType,
  updateBannerType,
  getOptions,
  checkParent,
};
