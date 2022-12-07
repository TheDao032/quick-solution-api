const statusProductService = require('./status-product.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get options statusproduct
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_STATUSPRODUCT', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOptions,
};
