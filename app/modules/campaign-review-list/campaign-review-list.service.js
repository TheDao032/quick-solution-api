const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

/**
 * Check campagin id approved
 *
 * @param campaignId
 * @returns ServiceResponse
 */
const isApproved = async (campaignId = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CAMPAIGNID', campaignId)
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNREVIEWLIST_ISAPPROVED);

    const result = data.recordset[0];

    return new ServiceResponse(true, '', result.RESULT);
  } catch (e) {
    logger.error(e, {'function': 'campaignReviewListService.isApproved'});

    // If error response is approved
    return new ServiceResponse(true, '', 1);
  }
};

module.exports = {
  isApproved,
};
