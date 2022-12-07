const membershipService = require('./membership.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list
 */
const getListMembership = async (req, res, next) => {
  try {
    const serviceRes = await membershipService.getListMembership(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailMembership = async (req, res, next) => {
  try {
    const membership_id = req.params.membership_id;
    const serviceRes = await membershipService.detailMembership(membership_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const record = {};
    record.membership = serviceRes.getData();
    const member_id = record.membership.member_id;
    const serviceAccountRes = await membershipService.detailAccount(member_id);
    if(serviceAccountRes.isFailed()) {
      return next(serviceAccountRes);
    }
    record.account = serviceAccountRes.getData();
    const serviceContractRes = await membershipService.listContract(member_id);
    if(serviceContractRes.isFailed()) {
      return next(serviceContractRes);
    }
    record.contract = serviceContractRes.getData();
    const serviceHistoryRes = await membershipService.listHistory(member_id);
    if(serviceHistoryRes.isFailed()) {
      return next(serviceHistoryRes);
    }
    record.history = serviceHistoryRes.getData();
    return res.json(new SingleResponse(record));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusMembership = async (req, res, next) => {
  try {
    const membershipId = req.params.membership_id;

    // Check exists
    const serviceResDetail = await membershipService.detailMembership(membershipId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await membershipService.changeStatusMembership(membershipId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.MEMBERSHIP.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_Membership
 */
const deleteMembership = async (req, res, next) => {
  try {
    const membershipId = req.params.membership_id;
    // Check exists
    const serviceResDetail = await membershipService.detailMembership(membershipId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await membershipService.deleteMembership(membershipId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.MEMBERSHIP.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListMembership,
  detailMembership,
  changeStatusMembership,
  deleteMembership,
};
