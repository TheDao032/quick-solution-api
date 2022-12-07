const dataLeadsMeetingClass = require('../data-leads-meeting/data-leads-meeting.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const folderNameAttactment = 'dataleascmeeting';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');

const createDataleadsMeetingOrUpdate = async (bodyParams) => {
  let file_attactments = apiHelper.getValueFromObject(bodyParams, 'file_attactments');
  if (file_attactments && file_attactments.length > 0) {
    for(let i = 0;i < file_attactments.length;i++) {
      const item = file_attactments[i];
      const pathAttactment = await saveFileAttactment(item.attachment_path,item.attachment_name); // eslint-disable-line no-await-in-loop
      if (pathAttactment)
        item.attachment_path = pathAttactment;
      else
        return new ServiceResponse(false,RESPONSE_MSG.FILEATTACTMENT.UPLOAD_FAILED);
    }
  }
  const task_data_leads= await getTaskDataleadsByTaskID(apiHelper.getValueFromObject(bodyParams, 'data_leads_id'), apiHelper.getValueFromObject(bodyParams, 'task_id'));
  if(!task_data_leads) {
    return new ServiceResponse(false,RESPONSE_MSG.DATALEADSMEETING.CREATE_FAILED);
  }

  const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestDataleadsMeeting = new sql.Request(transaction);
    const resultDataleadsMeeting = await requestDataleadsMeeting // eslint-disable-line no-await-in-loop
      .input('DATALEADSMEETINGID', apiHelper.getValueFromObject(bodyParams, 'data_leads_meeting_id'))
      .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
      .input('TASKID', apiHelper.getValueFromObject(bodyParams, 'task_id'))
      .input('RESPONSIBLEUSERNAME', apiHelper.getValueFromObject(bodyParams, 'responsible_user_name'))
      .input('MEETINGSUBJECT', apiHelper.getValueFromObject(bodyParams, 'meeting_subject'))
      .input('CONTENTMEETING', apiHelper.getValueFromObject(bodyParams, 'content_meeting'))
      .input('LOCATION', apiHelper.getValueFromObject(bodyParams, 'location'))
      .input('EVENTSTARTDATETIME', apiHelper.getValueFromObject(bodyParams, 'event_start_date_time'))
      .input('EVENTENDDATETIME', apiHelper.getValueFromObject(bodyParams, 'event_end_date_time'))
      .input('CREATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.CRM_DATALEADSMEETING_CREATEORUPDATE);
    const data_leads_meeting_id = resultDataleadsMeeting.recordset[0].RESULT;
    if (data_leads_meeting_id <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.DATALEADSMEETING.CREATE_FAILED);
    }
    const requestFileAttactmentDelete = new sql.Request(transaction);
    const resultFileAttactmentDelete = await requestFileAttactmentDelete // eslint-disable-line no-await-in-loop
      .input('ACTTIVEID', data_leads_meeting_id)
      .input('ISMEETING', 1)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.CRM_FILEATTACHMENT_DELETE);
    if (resultFileAttactmentDelete.recordset[0].RESULT !== 1) {
      return new ServiceResponse(false,RESPONSE_MSG.FILEATTACTMENT.CREATE_FAILED);
    }

    if (file_attactments && file_attactments.length > 0) {
      for(let i = 0;i < file_attactments.length;i++) {
        const item = file_attactments[i];
        const requestFileAttactment = new sql.Request(transaction);
        const resultFileAttactment = await requestFileAttactment // eslint-disable-line no-await-in-loop
          .input('ACTTIVEID', data_leads_meeting_id)
          .input('ATTACHMENTNAME', apiHelper.getValueFromObject(item, 'attachment_name'))
          .input('ATTACHMENTPATH', apiHelper.getValueFromObject(item, 'attachment_path'))
          .input('ISCOMMENT', 0)
          .input('ISCALL', 0)
          .input('ISMEETING', 1)
          .input('ISSMS', 0)
          .input('CREATEDUSER',auth_name)
          .execute(PROCEDURE_NAME.CRM_FILEATTACHMENT_CREATEORUPDATE);
        if (resultFileAttactment.recordset[0].RESULT <= 0) {
          return new ServiceResponse(false,RESPONSE_MSG.FILEATTACTMENT.CREATE_FAILED);
        }
      }
    }
    //Lưu history
    const requestHistory = new sql.Request(transaction);
    const resultHistory = await requestHistory
      .input('TASKDATALEADSID', apiHelper.getValueFromObject(task_data_leads, 'task_data_leads_id'))
      .input('TASKWORKFLOWID', apiHelper.getValueFromObject(task_data_leads, 'task_workflow_id'))
      .input('COMMENT', null)
      .input('DATALEADSSMSID', null)
      .input('COMMENTID', null)
      .input('DATALEADSMEETINGID', data_leads_meeting_id)
      .input('DATALEADEMAILID', null)
      .input('DATALEADSCALLID', null)
      .input('USERNAME', apiHelper.getValueFromObject(task_data_leads, 'user_name'))
      .input('SUPERVISORNAME', apiHelper.getValueFromObject(task_data_leads, 'supervisor_name'))
      .input('CREATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.CRM_HISTORY_DATALEADS_CREATE);
    if (resultHistory.recordset[0].RESULT <=0) {
      return new ServiceResponse(false,RESPONSE_MSG.HISTORYDATALEADS.CREATE_FAILED);
    }
    await transaction.commit();
    return new ServiceResponse(true,'',data_leads_meeting_id);
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsMeetingService.createDataleadsMeetingOrUpdate'});
    await transaction.rollback();
    // Return error
    return new ServiceResponse(false, e.message);
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
  }
  return null;
};

const getListDataleadsMeeting= async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id'))
      .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
      .execute(PROCEDURE_NAME.CRM_DATALEADSMEETING_GETLIST);

    let meetings = dataLeadsMeetingClass.list(data.recordset);
    if (meetings && meetings.length) {
      await Promise.all(meetings.map(async (item) => {
        let itemTemp = await item;
        const dataFileAttactment = await pool.request()
          .input('ACTTIVEID', item.comment_id)
          .input('ISMEETING', 1)
          .execute(PROCEDURE_NAME.CRM_FILEATTACHMENT_GETLIST);
        itemTemp.file_attactments = dataLeadsCommentClass.listFileAttactment(dataFileAttactment.recordset);
        item = itemTemp;
      }));
    }
    return new ServiceResponse(true, '', {
      'data': meetings,
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(data.recordset),
    });
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsMeetingService.getListDataleadsMeeting'});
    return new ServiceResponse(true, '', {});
  }
};
const saveFileAttactment = async (base64,filename) => {
  let url = null;
  try {
    if(fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromFileName(filename);
      if(extension) {
        const guid = createGuid();
        url = await fileHelper.saveBase64(folderNameAttactment, base64, `${guid}.${extension}`);
      }
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {'function': 'dataLeadsCommentService.saveFileAttactment'});
  }
  return url;
};
const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
module.exports = {
  createDataleadsMeetingOrUpdate,
  getListDataleadsMeeting,
};
