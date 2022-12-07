const taskDataLeadsClass = require('../task-data-lead/task-data-lead.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListTaskDataleads = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
      .input('BIRTHDAYFROM', apiHelper.getValueFromObject(queryParams, 'birth_day_from'))
      .input('BIRTHDAYTO', apiHelper.getValueFromObject(queryParams, 'birth_day_to'))
      .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
      .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
      .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
      .input('STATUS', apiHelper.getValueFromObject(queryParams, 'status'))
      .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_GETLIST);

    const taskDataleads = data.recordset;
    return new ServiceResponse(true, '', {
      'data': taskDataLeadsClass.listDataleads(taskDataleads),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(taskDataleads),
    });
  } catch (e) {
    logger.error(e, { 'function': 'taskDataLeadsClass.getListTaskDataleads' });
    return new ServiceResponse(true, '', {});
  }
};
const changeWorkFlow = async (body = {},task_data_leads) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestDataleads = new sql.Request(transaction);
    const resultDataleads = await requestDataleads // eslint-disable-line no-await-in-loop
      .input('TASKDATALEADSID', apiHelper.getValueFromObject(task_data_leads, 'task_data_leads_id'))
      .input('TASKWORKFLOWID', apiHelper.getValueFromObject(body, 'task_workflow_id'))
      .input('STATUSDATALEADSID', apiHelper.getValueFromObject(body, 'status_data_leads_id')||'0')
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_UPDATEWORKFLOW);
    if (resultDataleads.recordset[0].RESULT <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.TASKDATALEADS.CHANGE_WORKFLOW_FAILED);
    }

    //Lưu history
    const requestHistory = new sql.Request(transaction);
    const resultHistory = await requestHistory
      .input('TASKDATALEADSID', apiHelper.getValueFromObject(task_data_leads, 'task_data_leads_id'))
      .input('TASKWORKFLOWID', apiHelper.getValueFromObject(body, 'task_workflow_id'))
      .input('TASKWORKFLOWOLDID', apiHelper.getValueFromObject(task_data_leads, 'task_workflow_id'))
      .input('COMMENT', null)
      .input('DATALEADSSMSID', null)
      .input('COMMENTID', null)
      .input('DATALEADSMEETINGID', null)
      .input('DATALEADEMAILID', null)
      .input('DATALEADSCALLID', null)
      .input('USERNAME', apiHelper.getValueFromObject(task_data_leads, 'user_name'))
      .input('SUPERVISORNAME', apiHelper.getValueFromObject(task_data_leads, 'supervisor_name'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_HISTORY_DATALEADS_CREATE);
    if (resultHistory.recordset[0].RESULT <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.HISTORYDATALEADS.CREATE_FAILED);
    }
    await transaction.commit();
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, { 'function': 'taskDataLeadsClass.changeWorkFlow' });
    return new ServiceResponse(false, e.message);
  }
};
const getTaskDataleads = async (task_id,data_leads_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TASKID', task_id)
      .input('DATALEADSID', data_leads_id)
      .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_GETBYTASKID);
    if (data.recordset && data.recordset.length > 0) {
      return new ServiceResponse(true, '',taskDataLeadsClass.detailTaskDataleads(data.recordset[0]));
    }
    return new ServiceResponse(true, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'dataLeadsMeetingService.getTaskDataleads' });
    return new ServiceResponse(false, '');
  }
};
const getTaskDataleadsByNextPrevious = async (queryParams = {},type) => {
  try {

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
      .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id'))
      .input('TYPE', type)
      .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_GETNEXTPREVIOUS);

    const taskDataleads = data.recordset;

    if(taskDataleads && taskDataleads.length>0)
      return new ServiceResponse(true, '',taskDataLeadsClass.detailTaskDataleads(taskDataleads[0]));
    return new ServiceResponse(true, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'taskDataLeadsClass.getTaskDataleadsByNextPrevious' });
    return new ServiceResponse(false, '');
  }
};
module.exports = {
  getListTaskDataleads,
  getTaskDataleadsByNextPrevious,
  changeWorkFlow,
  getTaskDataleads,
};
