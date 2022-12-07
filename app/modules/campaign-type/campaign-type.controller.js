const campaignTypeService = require('./campaign-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Create new a CampaignType
 */
const createCampaignType = async (req, res, next) => {
  try {
    req.body.campaign_type_id = null;
    const serviceRes = await campaignTypeService.createCampaignTypeOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGNSTATUS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a CampaignType
 */
const updateCampaignType = async (req, res, next) => {
  try {
    const campaignTypeId = req.params.campaignTypeId;
    req.body.campaign_type_id = campaignTypeId;

    // // Check CampaignType exists
    // const serviceResDetail = await campaignTypeService.detailCampaignType(campaignTypeId);
    // if(serviceResDetail.isFailed()) {
    //   return next(serviceResDetail);
    // }

    const serviceRes = await campaignTypeService.createCampaignTypeOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGNTYPE.UPDATE_SUCCESS));
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
const getOptionForList = async (req, res, next) => {
  try {
    req.query.user_groups=req.auth.user_groups;
    req.query.isAdministrator =req.auth.isAdministrator;
    const typeFuctions = ['EDITFUNCTIONID','DELETEFUNCTIONID'];
    const serviceRes = await campaignTypeService.getOptionsAll(typeFuctions,req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
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
const getOptionForCreate = async (req, res, next) => {
  try {
    req.query.isAdministrator =req.auth.isAdministrator;
    req.query.user_groups=req.auth.user_groups;
    const typeFuctions = ['ADDFUNCTIONID'];
    const serviceRes = await campaignTypeService.getOptionsAll(typeFuctions,req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
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
const getListCampaignRlUser = async (req, res, next) => {
  try {
    const serviceRes = await campaignTypeService.getListCampaignRlUser(req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list campaigntype
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|Json|Format>}
 */
const getListCampaignType = async (req, res, next) => {
  try {
    const serviceRes = await campaignTypeService.getListCampaignType(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status campaigntype
 */
const changeStatusCampaignType = async (req, res, next) => {
  try {
    const campaignTypeId = req.params.campaignTypeId;

    // Check campaigntype exists
    // const serviceResDetail = await campaignTypeService.detailCampaignType(campaignTypeId);
    // if(serviceResDetail.isFailed()) {
    //   return next(serviceResDetail);
    // }

    // Update status
    const serviceResUpdate = await campaignTypeService.changeStatusCampaignType(campaignTypeId, req.body);
    if(serviceResUpdate.isFailed()) {
      return next(serviceResUpdate);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CAMPAIGNTYPE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail campaigntype
 */
const detailCampaignType = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await campaignTypeService.detailCampaignType(req.params.campaignTypeId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete campaigntype
 */
const deleteCampaignType = async (req, res, next) => {
  try {
    const campaignTypeId = req.params.campaignTypeId;

    // Check campaigntype exists
    const serviceResDetail = await campaignTypeService.detailCampaignType(campaignTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete campaigntype
    const serviceRes = await campaignTypeService.deleteCampaignType(campaignTypeId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CAMPAIGNTYPE.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createCampaignType,
  getOptionForList,
  getOptionForCreate,
  getListCampaignRlUser,
  getListCampaignType,
  updateCampaignType,
  changeStatusCampaignType,
  detailCampaignType,
  deleteCampaignType,
};
