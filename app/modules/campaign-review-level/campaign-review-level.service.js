const campaignReviewLevelClass = require('../campaign-review-level/campaign-review-level.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list AM_COMPANY
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCampaignReviewLevel = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNREVIEWLEVEL_GETLIST);

    const campaignReviewLevel = data.recordset;

    return new ServiceResponse(true, '', {
      'data': campaignReviewLevelClass.list(campaignReviewLevel),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(campaignReviewLevel),
    });
  } catch (e) {
    logger.error(e, {'function': 'campaignReviewLevelService.getListCampaignReviewLevel'});
    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
  getListCampaignReviewLevel,
};
