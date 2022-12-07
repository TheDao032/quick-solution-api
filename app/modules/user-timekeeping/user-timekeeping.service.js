const userTimeClass = require('../user-timekeeping/user-timekeeping.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const API_CONST = require('../../common/const/api.const');
const logger = require('../../common/classes/logger.class');
const xl = require('excel4node');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list AM_BUSINESS
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getList = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
      .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
      .input('STARTDATEFROM', apiHelper.getValueFromObject(queryParams, 'timekeeping_from'))
      .input('STARTDATETO', apiHelper.getValueFromObject(queryParams, 'timekeeping_to'))
      .execute(PROCEDURE_NAME.HR_USER_TIMEKEEPING_GETLIST);

    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      'data': userTimeClass.list(datas),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { 'function': 'userTimeService.getList' });

    return new ServiceResponse(true, '', {});
  }
};

const exportExcel = async (queryParams = {}) => {
  queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;

  const serviceRes = await getList(queryParams);
  const {data, total, page, limit} = serviceRes.getData();

  // Create a new instance of a Workbook class
  const wb = new xl.Workbook();
  // Add Worksheets to the workbook
  const ws = wb.addWorksheet('List user timekeeping', {});
  // Set width
  ws.column(1).setWidth(15);
  ws.column(2).setWidth(30);
  ws.column(3).setWidth(30);
  ws.column(4).setWidth(30);
  ws.column(5).setWidth(25);
  ws.column(6).setWidth(25);
  ws.column(7).setWidth(30);

  const header = {
    user_name: 'USER NAME',
    business_name: 'BUSINESS NAME',
    department_name: 'DEPARTMENT NAME',
    shift: 'SHIFT',
    timekeeping: 'TIMEKEEPING',
    time: 'TIME',
    confirm_time: 'CONFIRM TIME',
  };
  data.unshift(header);

  data.forEach((item, index) => {
    let indexRow = index + 1;
    let indexCol = 0;
    ws.cell(indexRow, ++indexCol).string(item.user_name ? item.user_name : '');
    ws.cell(indexRow, ++indexCol).string(item.business_name ? item.business_name : '');
    ws.cell(indexRow, ++indexCol).string(item.department_name ? item.department_name : '');
    ws.cell(indexRow, ++indexCol).string(item.shift ? item.shift : '');
    ws.cell(indexRow, ++indexCol).string(item.timekeeping ? item.timekeeping : '');
    ws.cell(indexRow, ++indexCol).string(item.time ? item.time : '');
    ws.cell(indexRow, ++indexCol).string(item.confirm_time ? item.confirm_time : '');
  });

  return new ServiceResponse(true, '', wb);
};

const approvedTime = async (bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('TIMEKEEPINGID', apiHelper.getValueFromObject(bodyParams, 'timeKeepingId'))
      .input('CONFIRMHOURSTART', apiHelper.getValueFromObject(bodyParams, 'confirm_hour_start'))
      .input('CONFIRMMINUTESTART', apiHelper.getValueFromObject(bodyParams, 'confirm_minute_start'))
      .input('CONFIRMHOUREND', apiHelper.getValueFromObject(bodyParams, 'confirm_hour_end'))
      .input('CONFIRMMINUTEEND', apiHelper.getValueFromObject(bodyParams, 'confirm_minute_end'))
      .execute(PROCEDURE_NAME.HR_USER_TIMEKEEPING_APPROVED);

    let result = data.recordset[0].RESULT;
    if(result === -1) {
      return new ServiceResponse(false, RESPONSE_MSG.HR_USER_TIMEKEEPING.NOT_FOUND);
    }

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'userTimeService.approvedTime'});

    return new ServiceResponse(false, e);
  }
};

const approvedTimes = async (bodyParams = {}) => {
  try {
    bodyParams.forEach((element) => {
      let startTime = element.start_time.split(':');
      let endTime = element.end_time.split(':');

      let data = {
        timeKeepingId: element.time_keeping_id,
        confirm_hour_start: startTime[0],
        confirm_minute_start: startTime[1],
        confirm_hour_end: endTime[0],
        confirm_minute_end: endTime[1],
      };

      approvedTime(data);
    });

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'userTimeService.approvedTimes'});

    return new ServiceResponse(false, e);
  }
};

module.exports = {
  getList,
  exportExcel,
  approvedTime,
  approvedTimes,
};
