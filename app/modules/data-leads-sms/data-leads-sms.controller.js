const dataLeadsSmsService = require('./data-leads-sms.service');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ListResponse = require('../../common/responses/list.response');
const smsService = require('../../common/services/sms.service');
/**
 * Get list 
 */
const getListDataleadsSms = async (req, res, next) => {
  try {
    const serviceRes = await dataLeadsSmsService.getListDataLeadsSms(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};
/**
 * Create new a MD_AREA
 */
const createDataLeadsSms= async (req, res, next) => {
  try {
    req.body.data_leads_sms_id = null;
    const serviceRes = await dataLeadsSmsService.createDataLeadsSmsOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DATALEADSSMS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
const sendSMSList = async (req, res, next) => {
  try {
    const serviceRes = await dataLeadsSmsService.createDataLeadsSmsOrUpdateList(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SENDSMS.SENDSMS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getListDataleadsSms,
  createDataLeadsSms,
  sendSMSList,
};
