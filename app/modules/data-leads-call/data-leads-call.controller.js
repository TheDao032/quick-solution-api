const dataLeadsCallService = require('./data-leads-call.service');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ListResponse = require('../../common/responses/list.response');
/**
 * Get list 
 */
const getListDataleadsCall = async (req, res, next) => {
  try {
    const serviceRes = await dataLeadsCallService.getListDataLeadsCall(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};
/**
 * Create new a MD_AREA
 */
const createDataLeadsCall= async (req, res, next) => {
  try {
    req.body.data_leads_call_id = null;
    const serviceRes = await dataLeadsCallService.createDataLeadsCallOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DATALEADSCALL.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListDataleadsCall,
  createDataLeadsCall,
};
