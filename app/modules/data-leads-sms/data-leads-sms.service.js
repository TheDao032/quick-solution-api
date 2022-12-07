const dataLeadsSmsClass = require('../data-leads-sms/data-leads-sms.class');
const dataLeadsMeetingClass = require('../data-leads-meeting/data-leads-meeting.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const smsService = require('../../common/services/sms.service');

const getListDataLeadsSms = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id'))
      .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
      .execute(PROCEDURE_NAME.CRM_DATALEADSSMS_GETLIST);

    const datas = data.recordset;
    return new ServiceResponse(true, '', {
      'data': dataLeadsSmsClass.listDataLeadsSms(datas),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsSmsServices.getListDataLeadsSms'});
    return new ServiceResponse(true, '', {});
  }
};
const createDataLeadsSmsOrUpdate = async (bodyParams) => {
  const task_data_leads= await getTaskDataleadsByTaskID(apiHelper.getValueFromObject(bodyParams, 'data_leads_id'), apiHelper.getValueFromObject(bodyParams, 'task_id'));
  if(!task_data_leads) {
    return new ServiceResponse(false,RESPONSE_MSG.DATALEADSSMS.CREATE_FAILED);
  }
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestDataleadsSms = new sql.Request(transaction);
    const resultDataleadsSMS = await requestDataleadsSms
      .input('DATALEADSSMSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_sms_id'))
      .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
      .input('TASKID', apiHelper.getValueFromObject(bodyParams, 'task_id'))
      .input('CONTENTSMS', apiHelper.getValueFromObject(bodyParams, 'content_sms'))
      .input('CREATEDUSER',apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_DATALEADSSMS_CREATEORUPDATE);
    const data_leads_sms_id = resultDataleadsSMS.recordset[0].RESULT;
    if (data_leads_sms_id <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.DATALEADSSMS.CREATE_FAILED);
    }
    //Lưu history
    const requestHistory = new sql.Request(transaction);
    const resultHistory = await requestHistory
      .input('TASKDATALEADSID', apiHelper.getValueFromObject(task_data_leads, 'task_data_leads_id'))
      .input('TASKWORKFLOWID', apiHelper.getValueFromObject(task_data_leads, 'task_workflow_id'))
      .input('COMMENT', null)
      .input('DATALEADSSMSID', data_leads_sms_id)
      .input('COMMENTID', null)
      .input('DATALEADSMEETINGID', null)
      .input('DATALEADEMAILID', null)
      .input('DATALEADSCALLID', null)
      .input('USERNAME', apiHelper.getValueFromObject(task_data_leads, 'user_name'))
      .input('SUPERVISORNAME', apiHelper.getValueFromObject(task_data_leads, 'supervisor_name'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_HISTORY_DATALEADS_CREATE);
    if (resultHistory.recordset[0].RESULT <=0) {
      return new ServiceResponse(false,RESPONSE_MSG.HISTORYDATALEADS.CREATE_FAILED);
    }
    // send sms
    const list_sms=[];
    const sms = {
      'phone_number': apiHelper.getValueFromObject(bodyParams, 'phone_number'),
      'message': apiHelper.getValueFromObject(bodyParams, 'content_sms'),
      'data_leads_sms_id': data_leads_sms_id,
      'content_type': '1',
    };
    list_sms.push(sms);
    let bodySms = bodyParams;
    bodySms.list_sms = list_sms;
    const serviceResSendSms = await smsService.sendSms(bodySms);
    if(serviceResSendSms.getData().data.Code !== '106')
    {
      return new ServiceResponse(false,RESPONSE_MSG.SENDSMS.SENDSMS_FAILED+': '+ serviceResSendSms.getData().data.Message);
    }
    await transaction.commit();

    return new ServiceResponse(true,'',data_leads_sms_id);
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsSmsServices.createDataLeadsSmsOrUpdate'});
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

const createDataLeadsSmsOrUpdateList = async (bodyParams) => {
  const task_data_leads_list = apiHelper.getValueFromObject(bodyParams, 'task_data_leads_list');
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    if(task_data_leads_list && task_data_leads_list.length > 0)
    {
      for(let i = 0;i < task_data_leads_list.length;i++) {
        const item = task_data_leads_list[i];
        let data_leads_sms_id = 0;
        const taskId = apiHelper.getValueFromObject(item, 'task_id');
        if(taskId > 0)
        {
          const task_data_leads= await getTaskDataleadsByTaskID(apiHelper.getValueFromObject(item, 'data_leads_id'), apiHelper.getValueFromObject(item, 'task_id'));// eslint-disable-line no-await-in-loop
          if(!task_data_leads) {
            return new ServiceResponse(false,RESPONSE_MSG.DATALEADSSMS.CREATE_FAILED);
          }
          const requestDataleadsSms = new sql.Request(transaction);
          const resultDataleadsSMS = await requestDataleadsSms // eslint-disable-line no-await-in-loop
            .input('DATALEADSID', apiHelper.getValueFromObject(item, 'data_leads_id'))
            .input('TASKID', apiHelper.getValueFromObject(item, 'task_id'))
            .input('CONTENTSMS', apiHelper.getValueFromObject(bodyParams, 'content_sms'))
            .input('CREATEDUSER',apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_DATALEADSSMS_CREATEORUPDATE);
          data_leads_sms_id = resultDataleadsSMS.recordset[0].RESULT;
          if (data_leads_sms_id <= 0) {
            return new ServiceResponse(false,RESPONSE_MSG.DATALEADSSMS.CREATE_FAILED);
          }
          //Lưu history
          const requestHistory = new sql.Request(transaction);
          const resultHistory = await requestHistory // eslint-disable-line no-await-in-loop
            .input('TASKDATALEADSID', apiHelper.getValueFromObject(task_data_leads, 'task_data_leads_id'))
            .input('TASKWORKFLOWID', apiHelper.getValueFromObject(task_data_leads, 'task_workflow_id'))
            .input('COMMENT', null)
            .input('DATALEADSSMSID', data_leads_sms_id)
            .input('COMMENTID', null)
            .input('DATALEADSMEETINGID', null)
            .input('DATALEADEMAILID', null)
            .input('DATALEADSCALLID', null)
            .input('USERNAME', apiHelper.getValueFromObject(task_data_leads, 'user_name'))
            .input('SUPERVISORNAME', apiHelper.getValueFromObject(task_data_leads, 'supervisor_name'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_HISTORY_DATALEADS_CREATE);
          if (resultHistory.recordset[0].RESULT <=0) {
            return new ServiceResponse(false,RESPONSE_MSG.HISTORYDATALEADS.CREATE_FAILED);
          }
        }
        // send sms
        const list_sms=[];
        const sms = {
          'phone_number': apiHelper.getValueFromObject(item, 'phone_number'),
          'message': apiHelper.getValueFromObject(bodyParams, 'content_sms'),
          'data_leads_sms_id': data_leads_sms_id,
          'content_type': '1',
        };
        list_sms.push(sms);
        let bodySms = bodyParams;
        bodySms.list_sms = list_sms;
        const serviceResSendSms = await smsService.sendSms(bodySms); // eslint-disable-line no-await-in-loop
        if(serviceResSendSms.getData().data.Code !== '106')
        {
          return new ServiceResponse(false,RESPONSE_MSG.SENDSMS.SENDSMS_FAILED+': '+ serviceResSendSms.getData().data.Message);
        }
      }
      await transaction.commit();
    }
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsSmsServices.createDataLeadsSmsOrUpdateList'});
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

module.exports = {
  getListDataLeadsSms,
  createDataLeadsSmsOrUpdate,
  createDataLeadsSmsOrUpdateList,
};
