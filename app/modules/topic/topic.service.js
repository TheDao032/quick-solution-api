const topicClass = require('../topic/topic.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
/**
 * Get list 
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListTopic = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CMS_TOPIC_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': topicClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'topicService.getListTopic'});
    return new ServiceResponse(true, '', {});
  }
};

const detailTopic = async (topicId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TOPICID', topicId)
      .execute(PROCEDURE_NAME.CMS_TOPIC_GETBYID_ADMINWEB);

    let topic = data.recordset;

    // If exists 
    if (topic && topic.length>0) {
      topic = topicClass.detail(topic[0]);
      return new ServiceResponse(true, '', topic);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'topicService.detailTopic'});
    return new ServiceResponse(false, e.message);
  }
};
const createTopicOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    //check title
    const dataCheck = await pool.request()
      .input('TOPICID', apiHelper.getValueFromObject(bodyParams, 'topic_id'))
      .input('TOPICNAME', apiHelper.getValueFromObject(bodyParams, 'topic_name'))
      .execute(PROCEDURE_NAME.CMS_TOPIC_CHECKTITLE_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.TOPIC.EXISTS_TITLE, null);
    }
    const data = await pool.request()
      .input('TOPICID', apiHelper.getValueFromObject(bodyParams, 'topic_id'))
      .input('TOPICNAME', apiHelper.getValueFromObject(bodyParams, 'topic_name'))
      .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'descriptions'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_TOPIC_CREATEORUPDATE_ADMINWEB);
    const topicId = data.recordset[0].RESULT;
    return new ServiceResponse(true,'',topicId);
  } catch (e) {
    logger.error(e, {'function': 'topicService.createTopicOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusTopic = async (topicId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('TOPICID', topicId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_TOPIC_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'topicService.changeStatusTopic'});
    return new ServiceResponse(false);
  }
};

const deleteTopic = async (topicId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('TOPICID',topicId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_TOPIC_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.TOPIC.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'topicService.deleteTopic'});
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListTopic,
  detailTopic,
  createTopicOrUpdate,
  deleteTopic,
  changeStatusTopic,
};
