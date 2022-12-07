const setupServiceService = require('./setup-service.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list
 */

const getListMetaTitle = async (req, res, next) => {
  try {
    const serviceRes = await setupServiceService.getListMetaTitle(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const getListMetaKeyword = async (req, res, next) => {
  try {
    const serviceRes = await setupServiceService.getListMetaKeyword(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const checkMetaTitle = async (req, res, next) => {
  try {
    const serviceRes = await setupServiceService.checkMetaTitle(req.body);
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
    const serviceRes = await setupServiceService.checkMetaKeyword(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null));
  } catch (error) {
    return next(error);
  }
};

const getListSetupService = async (req, res, next) => {
  try {
    const serviceRes = await setupServiceService.getListSetupService(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailSetupService = async (req, res, next) => {
  try {
    const serviceRes = await setupServiceService.detailSetupService(req.params.setupServiceId);
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
const createSetupService= async (req, res, next) => {
  try {
    req.body.setup_service_id = null;
    const serviceRes = await setupServiceService.createSetupService(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SETUPSERVICE.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateSetupService = async (req, res, next) => {
  try {
    const setupServiceId = req.params.setupServiceId;
    req.body.setup_service_id = setupServiceId;

    const serviceResDetail = await setupServiceService.detailSetupService(setupServiceId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await setupServiceService.createSetupService(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SETUPSERVICE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusSetupService = async (req, res, next) => {
  try {
    const setupServiceId = req.params.setupServiceId;

    const serviceResDetail = await setupServiceService.detailSetupService(setupServiceId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await setupServiceService.changeStatusSetupService(setupServiceId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.SETUPSERVICE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


/**
 * Delete
 */
const deleteSetupService = async (req, res, next) => {
  try {
    const setupServiceId = req.params.setupServiceId;

    const serviceResDetail = await setupServiceService.detailSetupService(setupServiceId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await setupServiceService.deleteSetupService(setupServiceId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.SETUPSERVICE.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListSetupService,
  detailSetupService,
  createSetupService,
  updateSetupService,
  deleteSetupService,
  changeStatusSetupService,
  getListMetaTitle,
  getListMetaKeyword,
  checkMetaTitle,
  checkMetaKeyword,
};
