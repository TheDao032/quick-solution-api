const setupServiceRegisterService = require('./setup-service-register.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list all MD_STORE
 */
const getListAllSetupService = async (req, res, next) => {
  try {
    const serviceRes = await setupServiceRegisterService.getListAllSetupService(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list
 */
const getListSetupServiceRegister = async (req, res, next) => {
  try {
    const serviceRes = await setupServiceRegisterService.getListSetupServiceRegister(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailSetupServiceRegister = async (req, res, next) => {
  try {
    const serviceRes = await setupServiceRegisterService.detailSetupServiceRegister(req.params.registerSetupId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteSetupServiceRegister = async (req, res, next) => {
  try {
    const registerSetupId = req.params.registerSetupId;

    const serviceResDetail = await setupServiceRegisterService.detailSetupServiceRegister(registerSetupId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await setupServiceRegisterService.deleteSetupServiceRegister(registerSetupId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.SETUPSERVICEREGISTER.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListAllSetupService,
  getListSetupServiceRegister,
  detailSetupServiceRegister,
  deleteSetupServiceRegister,
};
