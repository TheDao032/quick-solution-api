const campaignStatusService = require('./campaign-status.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list AM_COMPANY
 */
const getListCampaignStatus = async (req, res, next) => {
  try {
    const serviceRes = await campaignStatusService.getListCampaignStatus(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_CAMPAIGNSTATUS
 */
const detailCampaignStatus = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await campaignStatusService.detailCampaignStatus(req.params.campaignStatusId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a AM_COMPANY
 */
const createCampaignStatus = async (req, res, next) => {
  try {
    req.body.campaign_status_id = null;
    const serviceRes = await campaignStatusService.createCampaignStatusOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGNSTATUS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a Company
 */
const updateCampaignStatus = async (req, res, next) => {
  try {
    const campaignStatusId = req.params.campaignStatusId;
    req.body.campaign_status_id = campaignStatusId;

    // Check company exists
    const serviceResDetail = await campaignStatusService.detailCampaignStatus(campaignStatusId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update company
    const serviceRes = await campaignStatusService.createCampaignStatusOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGNSTATUS.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status AM_COMPANY
 */
const changeStatusCampaignStatus = async (req, res, next) => {
  try {
    const campaignStatusId = req.params.campaignStatusId;

    // Check userGroup exists
    const serviceResDetail = await campaignStatusService.detailCampaignStatus(campaignStatusId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await campaignStatusService.changeStatusCampaignStatus(campaignStatusId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.CAMPAIGNSTATUS.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_CAMPAIGNSTATUS
 */
const deleteCampaignStatus = async (req, res, next) => {
  try {
    const campaignStatusId = req.params.campaignStatusId;

    // Check company exists
    const serviceResDetail = await campaignStatusService.detailCampaignStatus(campaignStatusId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete company
    const serviceRes = await campaignStatusService.deleteCampaignStatus(campaignStatusId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CAMPAIGNSTATUS.DELETE_SUCCESS));
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
    const serviceRes = await optionService('CRM_CAMPAIGNSTATUS', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListCampaignStatus,
  detailCampaignStatus,
  createCampaignStatus,
  updateCampaignStatus,
  changeStatusCampaignStatus,
  deleteCampaignStatus,
  getOptions,
};
