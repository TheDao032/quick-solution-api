const httpStatus = require('http-status');
const userTimeService = require('./user-timekeeping.service');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const SingleResponse = require('../../common/responses/single.response');

/**
 * Get list business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await userTimeService.getList(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const exportExcel = async (req, res, next) => {
  try {
    const serviceRes = await userTimeService.exportExcel(req.query);
    const wb = serviceRes.getData();
    wb.write('LIST_USER_TIMEKEEPING.xlsx', res);
  } catch (error) {
    return next(error);
  }
};

const approvedTime = async (req, res, next) => {
  try {
    const timeKeepingId = req.params.timeKeepingId;
    req.body.timeKeepingId = timeKeepingId;
    const startTime = req.body.start_time.split(':');
    const endTime = req.body.end_time.split(':');

    req.body.confirm_hour_start = startTime[0];
    req.body.confirm_minute_start = startTime[1];
    req.body.confirm_hour_end = endTime[0];
    req.body.confirm_minute_end = endTime[1];

    const serviceRes = await userTimeService.approvedTime(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.HR_USER_TIMEKEEPING.APPROVED_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const approvedTimes = async (req, res, next) => {
  try {
    const serviceRes = await userTimeService.approvedTimes(req.body);

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.HR_USER_TIMEKEEPING.APPROVED_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

module.exports = {
  getList,
  exportExcel,
  approvedTime,
  approvedTimes,
};
