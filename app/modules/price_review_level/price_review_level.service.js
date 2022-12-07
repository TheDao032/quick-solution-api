/* eslint-disable no-await-in-loop */
const priceReviewLevelClass = require('../price_review_level/price_review_level.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const config = require('../../../config/config');

const getOptions = async function (queryParams) {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('IDS', apiHelper.getValueFromObject(queryParams, 'ids'))
      .execute(PROCEDURE_NAME.SL_PRICEREVIEWLEVEL_GETOPTIONS);
    return new ServiceResponse(true, '', priceReviewLevelClass.options(data.recordset));
  } catch (e) {
    logger.error(e, {
      'function': 'PriceReviewLevelService.getOptions',
    });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getOptions,
};
