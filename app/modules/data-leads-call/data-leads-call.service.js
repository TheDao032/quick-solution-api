const dataLeadsCallClass = require('../data-leads-call/data-leads-call.class');
const dataLeadsMeetingClass = require('../data-leads-meeting/data-leads-meeting.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getListDataLeadsCall = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id'))
      .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
      .execute(PROCEDURE_NAME.CRM_DATALEADSCALL_GETLIST);

    const datas = data.recordset;
    return new ServiceResponse(true, '', {
      'data': dataLeadsCallClass.listDataLeadsCall(datas),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsCallServices.getListDataLeadsCall'});
    return new ServiceResponse(true, '', {});
  }
};
const createDataLeadsCallOrUpdate = async (bodyParams) => {
  const task_data_leads= await getTaskDataleadsByTaskID(apiHelper.getValueFromObject(bodyParams, 'data_leads_id'), apiHelper.getValueFromObject(bodyParams, 'task_id'));
  if(!task_data_leads) {
    return new ServiceResponse(false,RESPONSE_MSG.DATALEADSCALL.CREATE_FAILED);
  }
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestDataleadsCall = new sql.Request(transaction);
    const resultDataleadsCall = await requestDataleadsCall
      .input('DATALEADSCALLID', apiHelper.getValueFromObject(bodyParams, 'data_leads_call_id'))
      .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
      .input('TASKID', apiHelper.getValueFromObject(bodyParams, 'task_id'))
      .input('RESPONSIBLEUSERNAME', apiHelper.getValueFromObject(bodyParams, 'responsible_user_name'))
      .input('CALLTYPEID', apiHelper.getValueFromObject(bodyParams, 'call_type_id'))
      .input('EVENTSTARTDATETIME', apiHelper.getValueFromObject(bodyParams, 'event_start_date_time'))
      .input('EVENTENDDATETIME', apiHelper.getValueFromObject(bodyParams, 'event_end_date_time'))
      .input('DURATION', apiHelper.getValueFromObject(bodyParams, 'duration'))
      .input('SUBJECT', apiHelper.getValueFromObject(bodyParams, 'subject'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('CREATEDUSER',apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_DATALEADSCALL_CREATEORUPDATE);
    const data_leads_call_id = resultDataleadsCall.recordset[0].RESULT;
    if (data_leads_call_id <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.DATALEADSCALL.CREATE_FAILED);
    }
    //Lưu history
    const requestHistory = new sql.Request(transaction);
    const resultHistory = await requestHistory
      .input('TASKDATALEADSID', apiHelper.getValueFromObject(task_data_leads, 'task_data_leads_id'))
      .input('TASKWORKFLOWID', apiHelper.getValueFromObject(task_data_leads, 'task_workflow_id'))
      .input('COMMENT', null)
      .input('DATALEADSSMSID', null)
      .input('COMMENTID', null)
      .input('DATALEADSMEETINGID', null)
      .input('DATALEADEMAILID', null)
      .input('DATALEADSCALLID', data_leads_call_id)
      .input('USERNAME', apiHelper.getValueFromObject(task_data_leads, 'user_name'))
      .input('SUPERVISORNAME', apiHelper.getValueFromObject(task_data_leads, 'supervisor_name'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_HISTORY_DATALEADS_CREATE);
    if (resultHistory.recordset[0].RESULT <=0) {
      return new ServiceResponse(false,RESPONSE_MSG.HISTORYDATALEADS.CREATE_FAILED);
    }
    await transaction.commit();
    return new ServiceResponse(true,'',data_leads_call_id);
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsCallServices.createDataLeadsCallOrUpdate'});
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

const getTaskDataleadsByTaskID = async (data_leads_id,task_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DATALEADSID', data_leads_id)
      .input('TASKID', task_id)
      .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_GETBYTASKID);
    if(data.recordset && data.recordset.length >0) {
      return dataLeadsMeetingClass.detailTaskDataleads(data.recordset[0]);
    }
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsMeetingService.getTaskDataleadsByTaskID'});
    return null;
  }

  return null;
};

module.exports = {
  getListDataLeadsCall,
  createDataLeadsCallOrUpdate,
};
