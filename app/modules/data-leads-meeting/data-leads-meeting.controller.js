const dataLeadsMeetingService = require('./data-leads-meeting.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list 
 */
const getListDataleadsMeeting = async (req, res, next) => {
  try {
    const serviceRes = await dataLeadsMeetingService.getListDataleadsMeeting(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createDataleadsMeeting = async (req, res, next) => {
  try {
    req.body.meeting_id = null;
    const serviceRes = await dataLeadsMeetingService.createDataleadsMeetingOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DATALEADSMEETING.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListDataleadsMeeting,
  createDataleadsMeeting,
};
