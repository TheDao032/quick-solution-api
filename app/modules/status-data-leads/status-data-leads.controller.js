const statusDataLeadsService = require('./status-data-leads.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list AM_COMPANY
 */
const getListStatusDataLeads = async (req, res, next) => {
  try {
    const serviceRes = await statusDataLeadsService.getListStatusDataLeads(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_StatusDataLeads
 */
const detailStatusDataLeads = async (req, res, next) => {
  try {
    const StatusDataLeadsId = req.params.status_data_leads_id;
    const serviceRes = await statusDataLeadsService.detailStatusDataLeads(StatusDataLeadsId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createStatusDataLeads = async (req, res, next) => {
  try {
    req.body.status_data_leads_id = null;
    const serviceRes = await statusDataLeadsService.createStatusDataLeadsOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STATUSDATALEADS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update 
 */
const updateStatusDataLeads = async (req, res, next) => {
  try {
    const StatusDataLeadsId = req.params.status_data_leads_id;
    req.body.status_data_leads_id = StatusDataLeadsId;

    // Check company exists
    const serviceResDetail = await statusDataLeadsService.detailStatusDataLeads(StatusDataLeadsId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update company
    const serviceRes = await statusDataLeadsService.createStatusDataLeadsOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STATUSDATALEADS.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status AM_COMPANY
 */
const changeStatusStatusDataLeads = async (req, res, next) => {
  try {
    const StatusDataLeadsId = req.params.status_data_leads_id;

    // Check exists
    const serviceResDetail = await statusDataLeadsService.detailStatusDataLeads(StatusDataLeadsId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await statusDataLeadsService.changeStatusStatusDataLeads(StatusDataLeadsId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.STATUSDATALEADS.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_StatusDataLeads
 */
const deleteStatusDataLeads = async (req, res, next) => {
  try {
    const StatusDataLeadsId = req.params.status_data_leads_id;
    // Check exists
    const serviceResDetail = await statusDataLeadsService.detailStatusDataLeads(StatusDataLeadsId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete company
    const serviceRes = await statusDataLeadsService.deleteStatusDataLeads(StatusDataLeadsId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.STATUSDATALEADS.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await statusDataLeadsService.getOptions(req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListStatusDataLeads,
  detailStatusDataLeads,
  createStatusDataLeads,
  updateStatusDataLeads,
  changeStatusStatusDataLeads,
  deleteStatusDataLeads,
  getOptions,
};
