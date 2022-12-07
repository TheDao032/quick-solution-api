const campaignReviewLeveService = require('./campaign-review-level.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list AM_COMPANY
 */
const getListCampaignReviewLevel = async (req, res, next) => {
  try {
    const serviceRes = await campaignReviewLeveService.getListCampaignReviewLevel(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListCampaignReviewLevel,
};
