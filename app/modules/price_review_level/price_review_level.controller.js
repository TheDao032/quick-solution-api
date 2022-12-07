const priceReviewLevelService = require('./price_review_level.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list options Product
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await priceReviewLevelService.getOptions(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceResDetail);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOptions,
};
