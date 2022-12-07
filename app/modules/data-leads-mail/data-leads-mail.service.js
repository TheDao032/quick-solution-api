const dataLeadsMailClass = require('../data-leads-mail/data-leads-mail.class');
const customerDataLeadClass = require('../customer-data-lead/customer-data-lead.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');

const createDataLeadsMailOrUpdate = async (bodyParams) => {

  const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
  let data_task_data_leads = [];
  for (let i = 0; i < bodyParams.task_data_leads.length; i++) {
    const params = bodyParams.task_data_leads[i];
    const task_id = apiHelper.getValueFromObject(params, 'task_id');
    if(!task_id)
      continue;
    const task_data_leads = await getTaskDataleadsByTaskID(apiHelper.getValueFromObject(params, 'data_leads_id'), apiHelper.getValueFromObject(params, 'task_id')); // eslint-disable-line no-await-in-loop
    if (!task_data_leads) {
      return new ServiceResponse(false, RESPONSE_MSG.DATALEADSMAIL.CREATE_FAILED);
    }
    task_data_leads.data_leads_mail_id = params.data_leads_mail_id;
    data_task_data_leads.push(task_data_leads);
  }
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    for (let i = 0; i < data_task_data_leads.length; i++) {
      const task_id = apiHelper.getValueFromObject(data_task_data_leads[i], 'task_id');
      if(!task_id)
        continue;
      const requestDataleadsMail = new sql.Request(transaction);
      const resultDataleadsMail = await requestDataleadsMail // eslint-disable-line no-await-in-loop
        .input('DATALEADSMAILID', apiHelper.getValueFromObject(data_task_data_leads[i], 'data_leads_mail_id'))
        .input('DATALEADSID', apiHelper.getValueFromObject(data_task_data_leads[i], 'data_leads_id'))
        .input('TASKID', apiHelper.getValueFromObject(data_task_data_leads[i], 'task_id'))
        .input('CAMPAIGNID', apiHelper.getValueFromObject(bodyParams, 'campaign_id'))
        .input('CAMPAIGNNAME', apiHelper.getValueFromObject(bodyParams, 'campaign_name'))
        .input('SENDERID', apiHelper.getValueFromObject(bodyParams, 'sender_id'))
        .input('SENDERNAME', apiHelper.getValueFromObject(bodyParams, 'sender_name'))
        .input('SENDEREMAIL', apiHelper.getValueFromObject(bodyParams, 'sender_email'))
        .input('LISTID', apiHelper.getValueFromObject(bodyParams, 'list_id'))
        .input('LISTNAME', apiHelper.getValueFromObject(bodyParams, 'list_name'))
        .input('STATUS', apiHelper.getValueFromObject(bodyParams, 'status'))
        .input('CREATEDUSER', auth_name)
        .execute(PROCEDURE_NAME.CRM_DATALEADSMAIL_CREATEORUPDATE);
      const data_leads_mail_id = resultDataleadsMail.recordset[0].RESULT;
      if (data_leads_mail_id <= 0) {
        return new ServiceResponse(false, RESPONSE_MSG.DATALEADSMAIL.CREATE_FAILED);
      }

      //Lưu history
      const requestHistory = new sql.Request(transaction);
      const resultHistory = await requestHistory // eslint-disable-line no-await-in-loop
        .input('TASKDATALEADSID', apiHelper.getValueFromObject(data_task_data_leads[i], 'task_data_leads_id'))
        .input('TASKWORKFLOWID', apiHelper.getValueFromObject(data_task_data_leads[i], 'task_workflow_id'))
        .input('COMMENT', null)
        .input('DATALEADSSMSID', null)
        .input('COMMENTID', null)
        .input('DATALEADEMAILID', data_leads_mail_id)
        .input('DATALEADSMEETINGID', null)
        .input('DATALEADSCALLID', null)
        .input('USERNAME', apiHelper.getValueFromObject(data_task_data_leads[i], 'user_name'))
        .input('SUPERVISORNAME', apiHelper.getValueFromObject(data_task_data_leads[i], 'supervisor_name'))
        .input('CREATEDUSER', auth_name)
        .execute(PROCEDURE_NAME.CRM_HISTORY_DATALEADS_CREATE);
      if (resultHistory.recordset[0].RESULT <= 0) {
        return new ServiceResponse(false, RESPONSE_MSG.HISTORYDATALEADS.CREATE_FAILED);
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, { 'function': 'dataLeadsMailService.createDataLeadsMailOrUpdate' });
    await transaction.rollback();
    // Return error
    return new ServiceResponse(false, e.message);
  }
};

const getTaskDataleadsByTaskID = async (data_leads_id, task_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DATALEADSID', data_leads_id)
      .input('TASKID', task_id)
      .execute(PROCEDURE_NAME.CRM_TASKDATALEADS_GETBYTASKID);
    if (data.recordset && data.recordset.length > 0) {
      return dataLeadsMailClass.detailTaskDataleads(data.recordset[0]);
    }
  } catch (e) {
    logger.error(e, { 'function': 'dataLeadsMailService.getTaskDataleadsByTaskID' });
    return null;
  }
};

const detailCustomerDataLead = async (customerDataLeadId) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('DATALEADSID', customerDataLeadId)
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GETBYID);

    let customerDataLead = data.recordsets[0];

    if (customerDataLead && customerDataLead.length) {
      customerDataLead = customerDataLeadClass.detail(customerDataLead[0]);
      return new ServiceResponse(true, '', customerDataLead);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'dataLeadsMailService.detailCustomerDataLead' });

    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  createDataLeadsMailOrUpdate,
  detailCustomerDataLead,
};
