const campaignService = require('./campaign.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const campaignReviewListService = require('../campaign-review-list/campaign-review-list.service');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');

/**
 * Get list CRM_CAMPAIGN
 */
const getListCampaign = async (req, res, next) => {
  try {
    const serviceRes = await campaignService.getListCampaign(req.query);
    const {data, total, page, limit} = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a CRM_CAMPAIGN
 */
const createCampaign = async (req, res, next) => {
  try {
    req.body.campaign_id = null;

    const serviceRes = await campaignService.createCampaign(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGN.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a campaign
 */
const updateCampaign = async (req, res, next) => {
  try {
    const bodyParams = req.body;
    const campaignId = req.params.campaignId;
    bodyParams.campaign_id = campaignId;

    // Check campaign exists
    const serviceResDetail = await campaignService.detailCampaign(campaignId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Check campaign is approved
    const isApprovedServiceRes = await campaignReviewListService.isApproved(campaignId);
    const isApproved = isApprovedServiceRes.getData();
    if(isApproved) {
      return next(new ErrorResponse(httpStatus.BAD_REQUEST, {}, RESPONSE_MSG.CAMPAIGN.UPDATED_FAILED_CAMPAIGN_APPROVED));
    }

    // When update => do not allow update campaign_type_id
    const campaignDetail = serviceResDetail.getData();
    bodyParams.campaign_type_id = campaignDetail.campaign_type_id;
    // Update campaign
    const serviceRes = await campaignService.updateCampaign(bodyParams);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGN.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_CAMPAIGN
 */
const deleteCampaign = async (req, res, next) => {
  try {
    const campaignId = req.params.campaignId;

    // Check campaign exists
    const serviceResDetail = await campaignService.detailCampaign(campaignId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Check campaign is approved
    const isApprovedServiceRes = await campaignReviewListService.isApproved(campaignId);
    const isApproved = isApprovedServiceRes.getData();
    if(isApproved) {
      return next(new ErrorResponse(httpStatus.BAD_REQUEST, {}, RESPONSE_MSG.CAMPAIGN.DELETE_FAILED_CAMPAIGN_APPROVED));
    }

    // Delete campaign
    const dataDelete = {
      'campaign_id': campaignId,
      'user_name': req.auth.user_name,
    };
    const serviceRes = await campaignService.deleteCampaign(dataDelete);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CAMPAIGN.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_CAMPAIGN
 */
const detailCampaign = async (req, res, next) => {
  try {
    // Check campaign exists
    const serviceRes = await campaignService.detailCampaign(req.params.campaignId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status CRM_CAMPAIGN
 */
const changeStatusCampaign = async (req, res, next) => {
  try {
    const campaignId = req.params.campaignId;

    // Check campaign exists
    const serviceResDetail = await campaignService.detailCampaign(campaignId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    const dataUpdate = {
      'campaign_id': campaignId,
      'is_active': req.body.is_active,
      'user_name': req.auth.user_name,
    };
    const serviceResUpdate = await campaignService.changeStatusCampaign(dataUpdate);
    if(serviceResUpdate.isFailed()) {
      return next(serviceResUpdate);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CAMPAIGN.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await campaignService.getOptions(req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * approved CRM_CAMPAIGN
 */
const approvedCampaignReviewList = async (req, res, next) => {
  try {
    const serviceRes = await campaignService.approvedCampaignReviewList(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};


/**
 * isapproved CRM_CAMPAIGN
 */
const isApproved = async (req, res, next) => {
  try {
    const campaignId = req.params.campaignId;
    // Check campaign exists
    const serviceResDetail = await campaignService.detailCampaign(campaignId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const isApprovedServiceRes = await campaignReviewListService.isApproved(campaignId);
    if(isApprovedServiceRes.isFailed()) {
      return next(isApprovedServiceRes);
    }
    return res.json(new SingleResponse({'is_approved': isApprovedServiceRes.getData()}));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  detailCampaign,
  changeStatusCampaign,
  getOptions,
  approvedCampaignReviewList,
  isApproved,
};
