const candidateService = require('./candidate.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list
 */
const getListCandidate = async (req, res, next) => {
  try {
    const serviceRes = await candidateService.getListCandidate(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list attachment
 */
const getListAttachment = async (req, res, next) => {
  try {
    const serviceRes = await candidateService.getListAttachment(req.params.candidateId);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail 
 */
const detailCandidate = async (req, res, next) => {
  try {
    const serviceRes = await candidateService.detailCandidate(req.params.candidateId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateCandidate = async (req, res, next) => {
  try {
    const candidateId = req.params.candidateId;
    req.body.candidate_id = candidateId;

    const serviceResDetail = await candidateService.detailCandidate(candidateId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const serviceRes = await candidateService.createCandidateOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CANDIDATE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusCandidate = async (req, res, next) => {
  try {
    const candidateId = req.params.candidateId;

    const serviceResDetail = await candidateService.detailCandidate(candidateId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await candidateService.changeStatusCandidate(candidateId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.CANDIDATE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


/**
 * Delete
 */
const deleteCandidate = async (req, res, next) => {
  try {
    const candidateId = req.params.candidateId;

    const serviceResDetail = await candidateService.detailCandidate(candidateId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await candidateService.deleteCandidate(candidateId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CANDIDATE.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListCandidate,
  detailCandidate,
  updateCandidate,
  deleteCandidate,
  changeStatusCandidate,
  getListAttachment,
};
