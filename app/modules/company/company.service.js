const companyClass = require('../company/company.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');

/**
 * Get list AM_COMPANY
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCompany = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
      .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
      .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.AM_COMPANY_GETLIST);

    const company = data.recordset;
    return new ServiceResponse(true, '', {
      'data': companyClass.list(company),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(company),
    });
  } catch (e) {
    logger.error(e, {'function': 'companyService.getListCompany'});
    return new ServiceResponse(true, '', {});
  }
};

const detailCompany = async (companyId) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('COMPANYID', companyId)
      .execute(PROCEDURE_NAME.AM_COMPANY_GETBYID);

    let company = data.recordset;
    // If exists SYS_USERGROUP
    if (company && company.length>0) {
      company = companyClass.detail(company[0]);
      return new ServiceResponse(true, '', company);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'companyService.detailCompany'});

    return new ServiceResponse(false, e.message);
  }
};
// CHECK EXISTS NAME, PHONE, EMAIL
const checkExists = async (companyId,companyName,phoneNumber,email) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('COMPANYID', companyId)
      .input('COMPANYNAME', companyName)
      .input('PHONENUMBER', phoneNumber)
      .input('EMAIL', email)
      .execute(PROCEDURE_NAME.AM_COMPANY_CHECKEXIST);
    let checkExists = data.recordset;
    if (checkExists && checkExists.length>0) {
      checkExists = companyClass.check(checkExists[0]);
      return checkExists;
    }
  } catch (e) {
    return null;
  }
};
const createCompanyOrUpdate = async (bodyParams) => {
  try {
    // CHECK EXISTS NAME, PHONE, EMAIL
    const check = await checkExists(apiHelper.getValueFromObject(bodyParams, 'company_id'),
      apiHelper.getValueFromObject(bodyParams, 'company_name'),
      apiHelper.getValueFromObject(bodyParams, 'phone_number'),
      apiHelper.getValueFromObject(bodyParams, 'email'));
    if(check && (check.exists_name) === 1)
    {
      return new ServiceResponse(false, RESPONSE_MSG.COMPANY.CHECK_NAME,null);
    }
    if(check && (check.exists_phone) === 1)
    {
      return new ServiceResponse(false, RESPONSE_MSG.COMPANY.CHECK_PHONE,null);
    }
    if(check && (check.exists_email) === 1)
    {
      return new ServiceResponse(false, RESPONSE_MSG.COMPANY.CHECK_EMAIL,null);
    }
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
      .input('COMPANYNAME', apiHelper.getValueFromObject(bodyParams, 'company_name'))
      .input('COMPANYTYPEID', apiHelper.getValueFromObject(bodyParams, 'company_type_id'))
      .input('OPENDATE', apiHelper.getValueFromObject(bodyParams, 'open_date'))
      .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
      .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email'))
      .input('FAX', apiHelper.getValueFromObject(bodyParams, 'fax'))
      .input('TAXID', apiHelper.getValueFromObject(bodyParams, 'tax_id'))
      .input('ZIPCODE', apiHelper.getValueFromObject(bodyParams, 'zip_code'))
      .input('BANKACCOUNTNAME', apiHelper.getValueFromObject(bodyParams, 'bank_account_name'))
      .input('BANKNAME', apiHelper.getValueFromObject(bodyParams, 'bank_name'))
      .input('BANKROUTING', apiHelper.getValueFromObject(bodyParams, 'bank_routing'))
      .input('BANKACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'bank_account_id'))
      .input('COUNTRYID', apiHelper.getValueFromObject(bodyParams, 'country_id'))
      .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
      .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
      .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
      .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
      .input('ADDRESSFULL', apiHelper.getValueFromObject(bodyParams, 'address_full'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.AM_COMPANY_CREATEORUPDATE);
    const companyId = data.recordset[0].RESULT;
    removeCacheOptions();
    return new ServiceResponse(true,'',companyId);
  } catch (e) {
    logger.error(e, {'function': 'companyService.createCompanyOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusCompany = async (companyId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('COMPANYID', companyId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.AM_COMPANY_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'companyService.changeStatusCompany'});

    return new ServiceResponse(false);
  }
};

const deleteCompany = async (companyId, bodyParams) => {
  try {

    const pool = await mssql.pool;

    const data = await pool.request()
      .input('COMPANYID', companyId)
      .execute(PROCEDURE_NAME.AM_COMPANY_CHECKUSED);

    let used = companyClass.detailUsed(data.recordset);
    if (used[0].result===1) { // used
      return new ServiceResponse(false, 'Company used by '+used[0].table_used, null);
    }

    await pool.request()
      .input('COMPANYID',companyId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.AM_COMPANY_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.COMPANY.AM_COMPANY_DELETE);
  } catch (e) {
    logger.error(e, {'function': 'companyService.deleteUserGroup'});
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.AM_COMPANY_OPTIONS);
};

const exportExcel = async (queryParams = {}) => {
  queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;

  const serviceRes = await getListCompany(queryParams);
  const {data, total, page, limit} = serviceRes.getData();

  // Create a new instance of a Workbook class
  const wb = new xl.Workbook();
  // Add Worksheets to the workbook
  const ws = wb.addWorksheet('List Company', {});
  // Set width
  ws.column(1).setWidth(15);
  ws.column(2).setWidth(40);
  ws.column(3).setWidth(40);
  ws.column(4).setWidth(50);
  ws.column(5).setWidth(40);

  const header = {
    company_id: 'COMPANY ID',
    company_name: 'COMPANY NAME',
    company_type_name: 'COMPANY TYPE NAME',
    address: 'ADDRESS',
    bank_name: 'BANK NAME',
  };
  data.unshift(header);

  data.forEach((item, index) => {
    let indexRow = index + 1;
    let indexCol = 0;
    ws.cell(indexRow, ++indexCol).string(item.company_id);
    ws.cell(indexRow, ++indexCol).string(item.company_name);
    ws.cell(indexRow, ++indexCol).string(item.company_type_name);
    ws.cell(indexRow, ++indexCol).string(item.address);
    ws.cell(indexRow, ++indexCol).string(item.bank_name);
  });

  return new ServiceResponse(true, '', wb);
};

module.exports = {
  getListCompany,
  detailCompany,
  createCompanyOrUpdate,
  changeStatusCompany,
  deleteCompany,
  exportExcel,
};
