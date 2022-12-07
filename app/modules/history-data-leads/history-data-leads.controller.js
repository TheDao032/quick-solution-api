const historyDataleadsService = require('./history-data-leads.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list
 */
const getListHistoryDataLeads = async (req, res, next) => {
  try {
    const serviceRes = await historyDataleadsService.getListHistoryDataLeads(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getListHistoryDataLeads,
};
