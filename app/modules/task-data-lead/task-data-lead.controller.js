const taskDataLeadService = require('./task-data-lead.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list CRM_SEGMENT
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await taskDataLeadService.getListTaskDataleads(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};
const getTaskDataleadsByNextPrevious = async (req, res, next) => {
  try {
    const result = {
    };
    const serviceResNext = await taskDataLeadService.getTaskDataleadsByNextPrevious(req.query,1);
    if (serviceResNext.isFailed()) {
      return next(serviceResNext);
    }
    result.next = serviceResNext.getData();
    const serviceResCurrent = await taskDataLeadService.getTaskDataleads(req.query.task_id,req.query.data_leads_id);
    if (serviceResCurrent.isFailed()) {
      return next(serviceResCurrent);
    }
    result.current = serviceResCurrent.getData();
    const serviceResPrevious = await taskDataLeadService.getTaskDataleadsByNextPrevious(req.query,0);
    if (serviceResPrevious.isFailed()) {
      return next(serviceResPrevious);
    }
    result.previous = serviceResPrevious.getData();
    return res.json(new SingleResponse(result, ''));
  } catch (error) {
    return next(error);
  }
};

const changeWorkFlow = async (req, res, next) => {
  try {
    const serviceResCurrent = await taskDataLeadService.getTaskDataleads(req.body.task_id,req.body.data_leads_id);
    if (serviceResCurrent.isFailed()) {
      return next(serviceResCurrent);
    }
    const task_data_leads = serviceResCurrent.getData();
    const serviceRes = await taskDataLeadService.changeWorkFlow(req.body,task_data_leads);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TASKDATALEADS.CHANGE_WORKFLOW_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getList,
  getTaskDataleadsByNextPrevious,
  changeWorkFlow,
};
