const contractTypeService = require('./contract-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

const getListContractType = async (req, res, next) => {
  try {
    const serviceRes = await contractTypeService.getListContractType(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};


const detailContractType = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await contractTypeService.detailContractType(req.params.contractTypeId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const createContractType = async (req, res, next) => {
  try {
    req.body.contract_type_id = null;
    const serviceRes = await contractTypeService.createContractTypeOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CONTRACTTYPE.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const updateContractType = async (req, res, next) => {
  try {
    const contractTypeId = req.params.contractTypeId;
    req.body.contract_type_id = contractTypeId;

    // Check segment exists
    const serviceResDetail = await contractTypeService.detailContractType(contractTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await contractTypeService.createContractTypeOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CONTRACTTYPE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


const changeStatusContractType = async (req, res, next) => {
  try {
    const contractTypeId = req.params.contractTypeId;

    // Check userGroup exists
    const serviceResDetail = await contractTypeService.detailContractType(contractTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await contractTypeService.changeStatusContractType(contractTypeId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACTTYPE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


const deleteContractType = async (req, res, next) => {
  try {
    const contractTypeId = req.params.contractTypeId;

    // Check area exists
    const serviceResDetail = await contractTypeService.detailContractType(contractTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await contractTypeService.deleteContractType(contractTypeId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACTTYPE.DELETE_SUCCESS));
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
    const serviceRes = await optionService('MD_CONTRACTTYPE', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListContractType,
  detailContractType,
  createContractType,
  updateContractType,
  changeStatusContractType,
  deleteContractType,
  getOptions,
};
