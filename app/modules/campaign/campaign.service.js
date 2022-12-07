const CampaignClass = require('../campaign/campaign.class');
const CampaignReviewListClass = require('../campaign-review-list/campaign-review-list.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const _ = require('lodash');
const API_CONST = require('../../common/const/api.const');

/**
 * Get list CRM_CAMPAIGN
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCampaign = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const orderBy = apiHelper.getOrderBy(queryParams);
    const campaignTypeId = apiHelper.getValueFromObject(queryParams, 'campaign_type_id');
    if(! campaignTypeId) {
      return new ServiceResponse(true, '', {});
    }

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      // .input('ORDERBYDES', orderBy)
      .input('CAMPAIGNTYPEID', campaignTypeId)
      .input('CAMPAIGNSTATUSID', apiHelper.getValueFromObject(queryParams, 'campaign_status_id'))
      .input('FROMSTARTDATE', apiHelper.getFilterBoolean(queryParams, 'from_start_date'))
      .input('TOSTARTDATE', apiHelper.getFilterBoolean(queryParams, 'to_start_date'))
      .input('FROMENDDATE', apiHelper.getFilterBoolean(queryParams, 'from_end_date'))
      .input('TOENDDATE', apiHelper.getFilterBoolean(queryParams, 'to_end_date'))
      .input('ISREVIEWED', apiHelper.getFilterBoolean(queryParams, 'is_reviewed'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGN_GETLIST);

    const campaigns = data.recordset;

    return new ServiceResponse(true, '', {
      'data': CampaignClass.list(campaigns),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(campaigns),
    });
  } catch (e) {
    logger.error(e, {'function': 'campaignService.getListCampaign'});

    return new ServiceResponse(true, '', {});
  }
};

/**
 * Create CRM_CAMPAIGN
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createCampaign = async (bodyParams = {}) => {
  return await createUserOrUpdate(bodyParams);
};

const updateCampaign = async (bodyParams = {}) => {
  return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  const isCreate = bodyParams.campaign_id ? false : true;

  try {
    // Begin transaction
    await transaction.begin();

    // Save CRM_CAMPAIGN
    const requestCampaign = new sql.Request(transaction);
    const resultCampaign = await requestCampaign
      .input('CAMPAIGNID', apiHelper.getValueFromObject(bodyParams, 'campaign_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
      .input('CAMPAIGNTYPEID', apiHelper.getValueFromObject(bodyParams, 'campaign_type_id'))
      .input('CAMPAIGNSTATUSID', apiHelper.getValueFromObject(bodyParams, 'campaign_status_id'))
      .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
      .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
      .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
      .input('CAMPAIGNNAME', apiHelper.getValueFromObject(bodyParams, 'campaign_name'))
      .input('TOTALVALUES', sql.Money, apiHelper.getValueFromObject(bodyParams, 'total_values'))
      .input('REASON', apiHelper.getValueFromObject(bodyParams, 'reason'))
      .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGN_CREATEORUPDATE);
    // Get CAMPAIGNID
    const campaignId = resultCampaign.recordset[0].RESULT;
    if(! campaignId) {
      throw new Error(RESPONSE_MSG.CAMPAIGN.CREATE_FAILED);
    }

    // Case create data
    if(isCreate) {
      // Delete CRM_CAMPAIGNREVIEWLIST
      const requestCampaignReviewListDelete = new sql.Request(transaction);
      const resultCampaignReviewList = await requestCampaignReviewListDelete
        .input('CAMPAIGNID', campaignId)
        .input('UPDATEDUSER', bodyParams.auth_name)
        .execute(PROCEDURE_NAME.CRM_CAMPAIGNREVIEWLIST_DELETE);
      // If store can not delete data
      if (! resultCampaignReviewList.recordset[0].RESULT) {
        throw new Error(RESPONSE_MSG.CAMPAIGNREVIEWLIST.DELETE_FAILED);
      }

      // Create CRM_CAMPAIGNREVIEWLIST
      const dataCampaignReviewLists = apiHelper.getValueFromObject(bodyParams, 'campaign_review_list', []);
      if (dataCampaignReviewLists.length) {
        const listCheckCampaignReviewLists = _.uniqBy(dataCampaignReviewLists, 'user_id');
        if(listCheckCampaignReviewLists.length !== dataCampaignReviewLists.length) {
          throw new Error(RESPONSE_MSG.CAMPAIGNREVIEWLIST.DOUBLE_USER_REVIEW);
        }

        for (let i = 0; i < dataCampaignReviewLists.length; i++) {
          let item = dataCampaignReviewLists[i];

          const campaignReviewLevelId = item.campaign_review_level_id;
          const userId = item.user_id;
          // If data valid
          if(campaignReviewLevelId && userId) {
            let requestCampaignReviewList = new sql.Request(transaction);
            let resultCampaignReviewList = await requestCampaignReviewList // eslint-disable-line no-await-in-loop
              .input('CAMPAIGNID', campaignId)
              .input('CAMPAIGNREVIEWLEVELID', campaignReviewLevelId)
              .input('REVIEWUSER', userId)
              .input('CREATEDUSER', bodyParams.auth_name)
              .execute(PROCEDURE_NAME.CRM_CAMPAIGNREVIEWLIST_CREATEORUPDATE);
            // Create CRM_CAMPAIGNREVIEWLIST failed
            if (!resultCampaignReviewList.recordset[0].RESULT) {
              throw new Error(RESPONSE_MSG.CAMPAIGNREVIEWLIST.CREATE_FAILED);
            }
          }
        }
      }
    }

    // Commit transaction
    await transaction.commit();

    // Return ok
    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.CAMPAIGN.CREATE_SUCCESS, {
      'campaign_id': campaignId,
    });
  } catch (e) {
    // Rollback transaction
    await transaction.rollback();

    // Write log
    logger.error(e, {'function': 'campaignService.createUserOrUpdate'});

    return new ServiceResponse(false, e);
  }
};

const detailCampaign = async (campaignId) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('CAMPAIGNID', campaignId)
      .execute(PROCEDURE_NAME.CRM_CAMPAIGN_GETBYID);


    let campaign = data.recordsets[0];
    let campaignReviewLists = data.recordsets[1];

    // If exists CRM_CAMPAIGN
    if (campaign && campaign.length) {
      campaign = CampaignClass.detail(campaign[0]);
      campaignReviewLists = CampaignReviewListClass.list(campaignReviewLists);

      campaign['campaign_review_list'] = campaignReviewLists;
      return new ServiceResponse(true, '', campaign);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'campaignService.detailCampaign'});

    return new ServiceResponse(false, e.message);
  }
};

const deleteCampaign = async (dataDelete = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();

    // Delete CRM_CAMPAIGN
    const requestCampaign = new sql.Request(transaction);
    const resultCampaign = await requestCampaign
      .input('CAMPAIGNID', apiHelper.getValueFromObject(dataDelete, 'campaign_id'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(dataDelete, 'user_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGN_DELETE);
    // If store can not delete data
    if (resultCampaign.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.CAMPAIGN.DELETE_FAILED);
    }

    // Delete Delete CRM_CAMPAIGNREVIEWLIST
    const requestCampaignReviewList = new sql.Request(transaction);
    const resultCampaignReviewList = await requestCampaignReviewList
      .input('CAMPAIGNID', apiHelper.getValueFromObject(dataDelete, 'campaign_id'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(dataDelete, 'user_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNREVIEWLIST_DELETE);
    // If store can not delete data
    if (resultCampaignReviewList.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.CAMPAIGNREVIEWLIST.DELETE_FAILED);
    }

    // Commit transaction
    await transaction.commit();
    removeCacheOptions();
    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'campaignService.deleteCampaign'});

    // Rollback transaction
    await transaction.rollback();

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusCampaign = async (dataUpdate = {}) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('CAMPAIGNID', apiHelper.getValueFromObject(dataUpdate, 'campaign_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(dataUpdate, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(dataUpdate, 'user_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGN_UPDATESTATUS);

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'campaignService.changeStatusCampaign'});

    return new ServiceResponse(false, e);
  }
};

const approvedCampaignReviewList = async (bodyParams = {}) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('REVIEWLISTID', apiHelper.getValueFromObject(bodyParams, 'review_list_id'))
      .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
      .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
      .input('USERNAME', bodyParams.auth_name)
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNREVIEWLIST_APPROVED);


    let result = data.recordset[0].RESULT;
    switch (result) {
      case 1:
        return new ServiceResponse(true, RESPONSE_MSG.CAMPAIGNREVIEWLIST.APPROVED_SUCCESS);
      case 0:
        return new ServiceResponse(false, RESPONSE_MSG.CAMPAIGNREVIEWLIST.APPROVED_FAILED, {'reason': 'Campaign review list was approved'});
      case -1:
        return new ServiceResponse(false, RESPONSE_MSG.CAMPAIGNREVIEWLIST.APPROVED_FAILED, {'reason': 'Campaign review list id exists'});
      default:
        return new ServiceResponse(false, RESPONSE_MSG.CAMPAIGNREVIEWLIST.APPROVED_FAILED, {'reason': 'Unknown'});
    }

  } catch (e) {
    logger.error(e, {'function': 'campaignService.approvedCampaignReviewList'});

    return new ServiceResponse(false, e.message);
  }
};

/**
 * Get options
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getOptionsDb = async function () {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('IsActive', API_CONST.ISACTIVE.ALL)
      .execute(PROCEDURE_NAME.CRM_CAMPAIGN_GETOPTIONS);
    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'campaignService.getOptions'});
    return [];
  }
};

const getOptions = async function (queryParams) {
  try {
    // Get parameter
    const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
    const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
    const businessId = apiHelper.getValueFromObject(queryParams, 'business_id');
    const companyId = apiHelper.getValueFromObject(queryParams, 'company_id');
    const campaignTypeId = apiHelper.getValueFromObject(queryParams, 'campaign_type_id');
    const campaignStatusId = apiHelper.getValueFromObject(queryParams, 'campaign_status_id');
    const isReviewed = apiHelper.getFilterBoolean(queryParams, 'is_reviewed')||3;
    const isExpired = apiHelper.getFilterBoolean(queryParams, 'is_expired')||2;
    const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
    // Get data from cache
    const data = await cache.wrap(CACHE_CONST.CRM_CAMPAIGN_OPTIONS, () => {
      return getOptionsDb();
    });

    // Filter values: empty, null, undefined
    const idsFilter = ids.filter((item) => { return item; });
    const dataFilter = _.filter(data, (item) => {
      let isFilter = true;
      if(Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
        isFilter = false;
      }
      if(Number(isReviewed) !== API_CONST.ISREVIEW.ALL) {
        if(Number(isReviewed) === 2 && Boolean(0) !== item.ISREVIEWED)
          isFilter = false;
        if(Number(isReviewed) === 1 && Boolean(1) !== item.ISREVIEWED)
          isFilter = false;
        if(Number(isReviewed) === 0 && null !== item.ISREVIEWED)
          isFilter = false;
      }
      if(Number(isExpired) !== API_CONST.ISACTIVE.ALL) {
        if(Number(isExpired) === 1) {
          if(!item.ENDDATE)
            isFilter = false;
          else {
            const toDate = new Date();
            const endDate = new Date(item.ENDDATE);
            if(endDate >= toDate)
              isFilter = false;
          }
        }
        if(Number(isExpired) === 0 && item.ENDDATE) {
          const toDate = new Date();
          const endDate = new Date(item.ENDDATE);
          if(endDate < toDate)
            isFilter = false;
        }
      }
      if(idsFilter.length && !idsFilter.includes(item.ID.toString())) {
        isFilter = false;
      }
      if(parentId && Number(parentId) !== Number(item.PARENTID)) {
        isFilter = false;
      }
      if(companyId && Number(companyId) !== Number(item.COMPANYID)) {
        isFilter = false;
      }
      if(businessId && Number(businessId) !== Number(item.BUSINESSID)) {
        isFilter = false;
      }
      if(campaignTypeId && Number(campaignTypeId) !== Number(item.CAMPAIGNTYPEID)) {
        isFilter = false;
      }
      if(campaignStatusId && Number(campaignStatusId) !== Number(item.CAMPAIGNSTATUSID)) {
        isFilter = false;
      }

      if(isFilter) {
        return item;
      }

      return null;
    });

    return new ServiceResponse(true, '', CampaignClass.options(dataFilter));
  } catch (e) {
    logger.error(e, {'function': 'campaignService.getOptions'});

    return new ServiceResponse(true, '', []);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_CAMPAIGN_OPTIONS);
};


module.exports = {
  getListCampaign,
  createCampaign,
  detailCampaign,
  updateCampaign,
  deleteCampaign,
  changeStatusCampaign,
  approvedCampaignReviewList,
  getOptions,
};
