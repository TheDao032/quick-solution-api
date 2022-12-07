const contractService = require('./contract.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
/**
 * Get list
 */
const getListContract= async (req, res, next) => {
  try {
    const serviceRes = await contractService.getListContract(req.query);
    const { data, total, page, limit } = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new 
 */
const createContract= async (req, res, next) => {
  try {
    req.body.contract_id = null;
    const serviceRes = await contractService.createContractOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a contract
 */
const updateContract= async (req, res, next) => {
  try {
    const bodyParams = req.body;
    const contract_id = req.params.contract_id;
    bodyParams.contract_id = contract_id;

    // Check contract exists
    const serviceResDetail = await contractService.detailContract(contract_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update contract
    const serviceRes = await contractService.createContractOrUpdate(bodyParams);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CONTRACT.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete 
 */
const deleteContract= async (req, res, next) => {
  try {
    const contract_id = req.params.contract_id;

    // Check contract exists
    const serviceResDetail = await contractService.detailContract(contract_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await contractService.deleteContract(contract_id,req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailContract= async (req, res, next) => {
  try {
    const serviceRes = await contractService.detailContract(req.params.contract_id,1);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
const approvedContract= async (req, res, next) => {
  try {
    const contract_id = req.params.contract_id;

    // Check contract exists
    const serviceResDetail = await contractService.detailContract(contract_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await contractService.approvedContract(contract_id,req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.APPROVED_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
const transferContract= async (req, res, next) => {
  try {
    const contract_id = req.params.contract_id;

    // Check contract exists
    const serviceResDetail = await contractService.detailContract(contract_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await contractService.transferContract(contract_id,req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.TRANSFER_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
const freezeContract= async (req, res, next) => {
  try {
    const contract_id = req.params.contract_id;

    // Check contract exists
    const serviceResDetail = await contractService.detailContract(contract_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const contract = serviceResDetail.getData();
    const serviceRes = await contractService.freezeContract(contract_id,contract.contract_type_id,req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.FREEZE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
const getProductInfo= async (req, res, next) => {
  try {
    const serviceRes = await contractService.getProductInfo(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getListContract,
  createContract,
  updateContract,
  deleteContract,
  detailContract,
  approvedContract,
  transferContract,
  freezeContract,
  getProductInfo,
};
