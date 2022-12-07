const historyDataleadsClass = require('../history-data-leads/history-data-leads.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');

const getListHistoryDataLeads = async (queryParams = {})=>{
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id'))
      .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
      .execute(PROCEDURE_NAME.CRM_HISTORY_DATALEADS_GETLIST);
    let histories = historyDataleadsClass.list(data.recordset);
    await Promise.all(histories.map(async (history) => {
      let historyTemp = await history;
      if(historyTemp.comment_id)
        historyTemp.expanded_content = await getDetailDataleadsComment(historyTemp.comment_id);
      else if(historyTemp.data_leads_sms_id)
        historyTemp.expanded_content = await getDetailDataleadsSMS(historyTemp.data_leads_sms_id);
      else if(historyTemp.data_leads_call_id)
        historyTemp.expanded_content = await getDetailDataleadsCall(historyTemp.data_leads_call_id);
      else if(historyTemp.data_leads_meeting_id) {
        historyTemp.expanded_content = await getDetailDataleadsMeeting(historyTemp.data_leads_meeting_id);
      }
      else if(historyTemp.data_leads_mail_id) {
        historyTemp.expanded_content = await getDetailDataleadsMail(historyTemp.data_leads_mail_id);
      }
      history = historyTemp;
    }));
    return new ServiceResponse(true, '', {
      'data': histories,
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(data.recordset),
    });
  } catch (e) {
    logger.error(e, {'function': 'historDataleadsService.getListHistoryDataLeads'});
    return new ServiceResponse(true, '', {});
  }
};
const getDetailDataleadsComment= async (comment_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('COMMENTID', comment_id)
      .execute(PROCEDURE_NAME.CRM_DATALEADSCOMMENT_GETBYID);
    if (data.recordset && data.recordset.length > 0) {
      let comment = historyDataleadsClass.detailComment(data.recordset[0]);
      const dataFileAttactment = await pool.request()
        .input('ACTTIVEID', comment.comment_id)
        .input('ISCOMMENT', 1)
        .execute(PROCEDURE_NAME.CRM_FILEATTACHMENT_GETLIST);
      comment.file_attactments = historyDataleadsClass.listFileAttactment(dataFileAttactment.recordset);
      return comment;
    }
    return null;
  } catch (e) {
    logger.error(e, {'function': 'historDataleadsService.getListDataleadsComment'});
    return null;
  }
};
const getDetailDataleadsSMS= async (data_leads_sms_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DATALEADSSMSID', data_leads_sms_id)
      .execute(PROCEDURE_NAME.CRM_DATALEADSSMS_GETBYID);
    if (data.recordset && data.recordset.length > 0) {
      const sms = historyDataleadsClass.detailSMS(data.recordset[0]);
      const dataFileAttactment = await pool.request()
        .input('ACTTIVEID', sms.data_leads_sms_id)
        .input('ISSMS', 1)
        .execute(PROCEDURE_NAME.CRM_FILEATTACHMENT_GETLIST);
      sms.file_attactments = historyDataleadsClass.listFileAttactment(dataFileAttactment.recordset);
      return sms;
    }
    return null;
  } catch (e) {
    logger.error(e, {'function': 'historDataleadsService.getDetailDataleadsSMS'});
    return null;
  }
};
const getDetailDataleadsMeeting= async (data_leads_meeting_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DATALEADSMEETINGID', data_leads_meeting_id)
      .execute(PROCEDURE_NAME.CRM_DATALEADSMEETING_GETBYID);
    if (data.recordset && data.recordset.length > 0) {
      const meeting = historyDataleadsClass.detailMeeting(data.recordset[0]);
      const dataFileAttactment = await pool.request()
        .input('ACTTIVEID', meeting.data_leads_meeting_id)
        .input('ISMEETING', 1)
        .execute(PROCEDURE_NAME.CRM_FILEATTACHMENT_GETLIST);
      meeting.file_attactments = historyDataleadsClass.listFileAttactment(dataFileAttactment.recordset);
      return meeting;
    }
    return null;
  } catch (e) {
    logger.error(e, {'function': 'historDataleadsService.getDetailDataleadsMeeting'});
    return null;
  }
};
const getDetailDataleadsCall= async (data_leads_call_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DATALEADSCALLID', data_leads_call_id)
      .execute(PROCEDURE_NAME.CRM_DATALEADSCALL_GETBYID);
    if (data.recordset && data.recordset.length > 0) {
      const call = historyDataleadsClass.detailCall(data.recordset[0]);
      return call;
    }
    return null;
  } catch (e) {
    logger.error(e, {'function': 'historDataleadsService.getDetailDataleadsCall'});
    return null;
  }
};
const getDetailDataleadsMail= async (data_leads_mail_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DATALEADSMAILID', data_leads_mail_id)
      .execute(PROCEDURE_NAME.CRM_DATALEADSMAIL_GETBYID);
    if (data.recordset && data.recordset.length > 0) {
      const call = historyDataleadsClass.detailMail(data.recordset[0]);
      return call;
    }
    return null;
  } catch (e) {
    logger.error(e, {'function': 'historDataleadsService.detailCMail'});
    return null;
  }
};
module.exports = {
  getListHistoryDataLeads,
};
