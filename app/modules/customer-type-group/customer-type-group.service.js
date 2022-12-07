const customerTypeGroupClass = require('../customer-type-group/customer-type-group.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_CUSTOMERTYPE_GROUP_OPTIONS);
};

module.exports = {
};
