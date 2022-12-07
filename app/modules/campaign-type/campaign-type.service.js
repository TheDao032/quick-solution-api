const campaigntypeClass = require('../campaign-type/campaign-type.class');
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
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');

const createCampaignTypeOrUpdate = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  const is_auto_review = apiHelper.getValueFromObject(bodyParams, 'is_auto_review');
  await transaction.begin();
  try {
    const requestCampaignType = new sql.Request(transaction);
    const resultCampaignType = await requestCampaignType // eslint-disable-line no-await-in-loop
      .input('CAMPAIGNTYPEID', apiHelper.getValueFromObject(bodyParams, 'campaign_type_id'))
      .input('CAMPAIGNTYPENAME', apiHelper.getValueFromObject(bodyParams, 'campaign_type_name'))
      .input('ADDFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'add_function_id'))
      .input('EDITFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'edit_function_id'))
      .input('DELETEFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'delete_function_id'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .input('ISAUTOREVIEW',is_auto_review)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNTYPE_CREATEORUPDATE);
    const campaign_type_id = resultCampaignType.recordset[0].RESULT;
    if (campaign_type_id <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.CAMPAIGNTYPE.CREATE_FAILED);
    }
    const requestCamTypeReLevelDelete = new sql.Request(transaction);
    const resultCamTypeReLevelDelete = await requestCamTypeReLevelDelete // eslint-disable-line no-await-in-loop
      .input('CAMPAIGNTYPEID', campaign_type_id)
      .execute(PROCEDURE_NAME.CRM_CAMPTYPE_RELEVEL_DELETE);
    if (resultCamTypeReLevelDelete.recordset[0].RESULT !== 1) {
      return new ServiceResponse(false,RESPONSE_MSG.CAMPAIGNTYPE.DELETE_CAMPTYPE_RELEVEL_FAILED);
    }
    if(is_auto_review !== 1) {
      const campaign_type_relevels = apiHelper.getValueFromObject(bodyParams, 'campaign_type_relevels');
      for(let i = 0;i < campaign_type_relevels.length;i++) {
        const item = campaign_type_relevels[i];
        const user_name = apiHelper.getValueFromObject(item, 'user_name')?apiHelper.getValueFromObject(item, 'user_name').join('|'):'';
        const requestCamTypeReLevel = new sql.Request(transaction);
        const resultCamTypeReLevel = await requestCamTypeReLevel // eslint-disable-line no-await-in-loop
          .input('CAMPAIGNTYPEID', campaign_type_id)
          .input('CAMPAIGNREVIEWLEVELID', apiHelper.getValueFromObject(item, 'campaign_review_level_id'))
          .input('REVIEWORDERINDEX', apiHelper.getValueFromObject(item, 'review_order_index'))
          .input('DEPARTMENTID', apiHelper.getValueFromObject(item, 'department_id'))
          .input('USERNAME', user_name)
          .execute(PROCEDURE_NAME.CRM_CAMPTYPE_RELEVEL_CREATE);
        if (resultCamTypeReLevel.recordset[0].RESULT <= 0) {
          return new ServiceResponse(false,RESPONSE_MSG.CAMPAIGNTYPE.CREATE_CAMPTYPE_RELEVEL_FAILED);
        }
      }
    }

    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true,'',campaign_type_id);
  } catch (e) {
    logger.error(e, {'function': 'campaignTypeService.createCampaignTypeOrUpdate'});
    await transaction.rollback();
    // Return error
    return new ServiceResponse(false, e.message);
  }
};

/**
 * Get options
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getOptions = async function () {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('IsActive', API_CONST.ISACTIVE.ALL)
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNTYPE_GETOPTIONS);

    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'CampaignTypeService.getOptions'});
    return [];
  }
};

/**
 * Get options
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getFunctionsByUserGroupId = async function (queryParams) {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('USERGROUPID', apiHelper.getValueFromObject(queryParams, 'user_groups'))
      .execute(PROCEDURE_NAME.SYS_USER_GETPERMISSIONBYUSERGROUP);

    return data.recordset;
  } catch (e) {
    logger.error(e, {'function': 'CampaignTypeService.getFunctionsByUserGroupId'});
    return [];
  }
};


const getOptionsAll = async (typeFuctions,queryParams = {}) => {
  try {
    // Get parameter
    const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
    const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
    const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
    const isAdministrator = apiHelper.getValueFromObject(queryParams, 'isAdministrator');
    //const typeFuctions = ['EDITFUNCTIONID','DELETEFUNCTIONID']; // check quyền xem , sửa, xóa ( cho danh sách)
    // Get data from cache
    const data = await cache.wrap(CACHE_CONST.CRM_CAMPAIGNTYPE_OPTIONS, () => {
      return getOptions();
    });
    //get list functions of usergroupid
    const getDataFunctions = await getFunctionsByUserGroupId(queryParams);
    const dataFunctions = campaigntypeClass.listFunctions(getDataFunctions);
    // Filter values: empty, null, undefined
    const idsFilter = ids.filter((item) => { return item; });
    const dataFilter = _.filter(data, (item) => {
      let isFilter = true;
      if(Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
        isFilter = false;
      }
      if(idsFilter.length && !idsFilter.includes(item.ID.toString())) {
        isFilter = false;
      }
      if(parentId && Number(parentId) !== item.PARENTID) {
        isFilter = false;
      }
      if(!dataFunctions || dataFunctions.length === 0)
      {
        isFilter = false;
      }
      if(isAdministrator !== 1)
      {
      // check quyền xem và xóa cho getoptions list
        if(typeFuctions && (typeFuctions.includes('EDITFUNCTIONID') || typeFuctions.includes('DELETEFUNCTIONID')))
        {
        // if check function edit or delete, nếu k có quyền thì k hiển thị item
          if(dataFunctions && dataFunctions.length && !dataFunctions.filter((vendor) => (vendor.function_id === item.EDITFUNCTIONID)).length > 0 && !dataFunctions.filter((vendor) => (vendor.function_id === item.DELETEFUNCTIONID)).length > 0)
          {
            isFilter = false;
          }
        }
        else if (typeFuctions && typeFuctions.includes('ADDFUNCTIONID'))
        {
          if(dataFunctions && dataFunctions.length && !dataFunctions.filter((vendor) => (vendor.function_id === item.ADDFUNCTIONID)).length>0)
          {
            isFilter = false;
          }
        }
      }

      if(isFilter) {
        item.ADD=false;
        item.EDIT=false;
        item.DELETE=false;
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.EDITFUNCTIONID)).length>0)
        {
          item.EDIT=true;
        }
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.DELETEFUNCTIONID)).length>0)
        {
          item.DELETE=true;
        }
        if(dataFunctions && dataFunctions.length && dataFunctions.filter((vendor) => (vendor.function_id === item.ADDFUNCTIONID)).length>0)
        {
          item.ADD=true;
        }
        return item;
      }
      return null;
    });

    return new ServiceResponse(true, '', campaigntypeClass.options(dataFilter));
  } catch (e) {
    logger.error(e, {'function': 'CampaignTypeService.getOptionsAll'});

    return new ServiceResponse(true, '', []);
  }
};

/**
 * Get list CRM_CAMPAIGN_RL_USER
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCampaignRlUser = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CAMPAIGNTYPEID', apiHelper.getValueFromObject(queryParams, 'campaign_type_id'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGN_RL_USER_GETBYCAMPAIGNTYPE);

    const rlUsers = campaigntypeClass.listRlUser(data.recordset);
    const res = rlUsers.reduce((acc, curr) => {
      if(!acc[curr.campaign_rl_id,curr.campaign_rl_name]) acc[curr.campaign_rl_id,curr.campaign_rl_name] = []; //If this type wasn't previously stored
      acc[curr.campaign_rl_id,curr.campaign_rl_name].push(
        {'campaign_rl_id':curr.campaign_rl_id,
          'full_name':curr.full_name,
          'user_name':curr.user_name,
          'user_id':curr.user_id,
          'default_picture_url':curr.default_picture_url,
        },
      );
      return acc;
    },{});
    const result = Object.keys(res).map((key) => {
      let objUsers = res[key];
      let users = Object.keys(objUsers).map((key1) => {
        return {
          'full_name':objUsers[key1].full_name,
          'user_name':objUsers[key1].user_name,
          'user_id':objUsers[key1].user_id,
          'default_picture_url':objUsers[key1].default_picture_url,
        };
      });
      return {'campaign_rl_name': key,
        'campaign_rl_id':res[key][0].campaign_rl_id,
        'users': users};
    });
    return new ServiceResponse(true, '', {
      'items': result,
    });
  } catch (e) {
    logger.error(e, {'function': 'CampaignTypeService.getListCampaignRlUser'});
    return new ServiceResponse(true, '', {});
  }
};
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_CAMPAIGNTYPE_OPTIONS);
};

const getListCampaignType = async function (queryParams) {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('ISAUTOREVIEW', apiHelper.getValueFromObject(queryParams, 'is_auto_review'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNTYPE_GETLIST);

    const campaignStatus = data.recordset;

    return new ServiceResponse(true, '', {
      'data': campaigntypeClass.list(campaignStatus),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(campaignStatus),
    });
  } catch (e) {
    logger.error(e, {'function': 'CampaignTypeService.getListCampaignType'});
    return new ServiceResponse(true, '', {});
  }
};

const changeStatusCampaignType = async (campaignTypeId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('CAMPAIGNTYPEID', campaignTypeId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNTYPE_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'CampaignTypeService.changeStatusCampaignType'});

    return new ServiceResponse(false, e);
  }
};

const detailCampaignType = async (campaignTypeId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CAMPAIGNTYPEID', campaignTypeId)
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNTYPE_GETBYID);

    let campaignType = data.recordset;
    if (campaignType && campaignType.length) {
      campaignType = campaigntypeClass.detail(campaignType[0]);
      return new ServiceResponse(true, '', campaignType);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'CampaignTypeService.detailCampaignType'});

    return new ServiceResponse(false, e.message);
  }
};

const deleteCampaignType = async (campaignTypeId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    const resultCampaignType = await pool.request()
      .input('CAMPAIGNTYPEID', campaignTypeId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'user_name'))
      .execute(PROCEDURE_NAME.CRM_CAMPAIGNTYPE_DELETE);

    if (resultCampaignType.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.CAMPAIGNTYPE.DELETE_FAILED);
    }

    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.CAMPAIGNSTATUS.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'CampaignTypeService.deleteCampaignType'});
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  createCampaignTypeOrUpdate,
  getFunctionsByUserGroupId,
  getOptionsAll,
  getListCampaignRlUser,
  getListCampaignType,
  changeStatusCampaignType,
  detailCampaignType,
  deleteCampaignType,
};
