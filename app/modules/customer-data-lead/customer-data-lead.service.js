const CustomerDataLeadClass = require('../customer-data-lead/customer-data-lead.class');
const TaskDataLeadClass = require('../task-data-lead/task-data-lead.class');
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
const _ = require('lodash');
const API_CONST = require('../../common/const/api.const');

/**
 * Get list CRM_CAMPAIGN
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCustomerDataLead = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    // const orderBy = apiHelper.getOrderBy(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      // .input('ORDERBYDES', orderBy)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
      .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
      .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
      .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
      .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
      .input('SEGMENTID', apiHelper.getValueFromObject(queryParams, 'segment_id'))
      .input('STATUSDATALEADSID', apiHelper.getValueFromObject(queryParams, 'status_data_leads_id'))
      .input('STATUSDATALEADSKEY', apiHelper.getValueFromObject(queryParams, 'status_data_leads_key'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('MARITALSTATUS', apiHelper.getFilterBoolean(queryParams, 'marital_status'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GetList);

    const customerDataLeads = data.recordset;

    return new ServiceResponse(true, '', {
      'data': CustomerDataLeadClass.list(customerDataLeads),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(customerDataLeads),
    });
  } catch (e) {
    logger.error(e, { 'function': 'customerDataLeadService.getListCustomerDataLead' });

    return new ServiceResponse(true, '', {});
  }
};

/**
 * Create CRM_CAMPAIGN
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createCustomerDataLead = async (bodyParams = {}) => {
  return await createOrUpdateCustomerDataLead(bodyParams);
};

const updateCustomerDataLead = async (bodyParams = {}) => {
  return await createOrUpdateCustomerDataLead(bodyParams);
};

const createOrUpdateCustomerDataLead = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    const countryName = apiHelper.getValueFromObject(bodyParams, 'country_name');
    const provinceName = apiHelper.getValueFromObject(bodyParams, 'province_name');
    const districtName = apiHelper.getValueFromObject(bodyParams, 'district_name');
    const wardName = apiHelper.getValueFromObject(bodyParams, 'ward_name');
    const address = apiHelper.getValueFromObject(bodyParams, 'address');
    let addressFull = (address?(address + ', '):'')
    +(wardName?(wardName + ', '):'')
    +(districtName?(districtName + ', '):'')
    +(provinceName?(provinceName + ', '):'')
    +(countryName?(countryName + ', '):'');
    if(addressFull.length > 0)
      addressFull = addressFull.substring(0, addressFull.length -2);
    //const addressFull = `${address}, ${wardName}, ${districtName}, ${provinceName}, ${countryName}`;
    // Begin transaction
    await transaction.begin();

    // Save CRM_CUSTOMERDATALEADS_CreateOrUpdate
    const requestCustomerDataLead = new sql.Request(transaction);
    const resultCustomerDataLead = await requestCustomerDataLead
      .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'customer_data_lead_id'))
      .input('FULLNAME', apiHelper.getValueFromObject(bodyParams, 'full_name'))
      .input('BIRTHDAY', apiHelper.getValueFromObject(bodyParams, 'birthday'))
      .input('GENDER', apiHelper.getValueFromObject(bodyParams, 'gender'))
      .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
      .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email'))
      .input('MARITALSTATUS', apiHelper.getValueFromObject(bodyParams, 'marital_status'))
      .input('IDCARD', apiHelper.getValueFromObject(bodyParams, 'id_card'))
      .input('IDCARDDATE', apiHelper.getValueFromObject(bodyParams, 'id_card_date'))
      .input('IDCARDPLACE', apiHelper.getValueFromObject(bodyParams, 'id_card_place'))
      .input('COUNTRYID', apiHelper.getValueFromObject(bodyParams, 'country_id'))
      .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
      .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
      .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
      .input('ADDRESS', address)
      .input('ADDRESSFULL', addressFull)
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      // .input('ADDRESSFULL', apiHelper.getValueFromObject(bodyParams, 'address_full'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CREATEORUPDATE);
    // Get DATALEADSID
    const customerDataLeadId = resultCustomerDataLead.recordset[0].RESULT;
    if (!customerDataLeadId) {
      throw new Error(RESPONSE_MSG.CRM_CUSTOMERDATALEADS.CREATE_FAILED);
    }

    // Delete CRM_CUSCAMPAIGN
    const requestCusCampaignDelete = new sql.Request(transaction);
    const resultCusCampaignDelete = await requestCusCampaignDelete
      .input('DATALEADSID', customerDataLeadId)
      .execute(PROCEDURE_NAME.CRM_CUSCAMPAIGN_DELETEBYDATALEADSID);
    // If store can not delete data
    if (!resultCusCampaignDelete.recordset[0].RESULT) {
      throw new Error(RESPONSE_MSG.CRM_CUSCAMPAIGN.DELETE_FAILED);
    }
    if(apiHelper.getValueFromObject(bodyParams, 'campaign_id')) {
    // Create CRM_CUSCAMPAIGN
      const requestCusCampaignCreate = new sql.Request(transaction);
      const resultCusCampaignCreate = await requestCusCampaignCreate
        .input('DATALEADSID', customerDataLeadId)
        .input('CAMPAIGNID', apiHelper.getValueFromObject(bodyParams, 'campaign_id'))
        .execute(PROCEDURE_NAME.CRM_CUSCAMPAIGN_CREATE);
      // If store can not create data
      if (!resultCusCampaignCreate.recordset[0].RESULT) {
        throw new Error(RESPONSE_MSG.CRM_CUSCAMPAIGN.CREATE_FAILED);
      }
    }
    // Delete CRM_SEG_DATALEADS
    const requestSegDataLeadsDelete = new sql.Request(transaction);
    const resultSegDataLeadsDelete = await requestSegDataLeadsDelete
      .input('DATALEADSID', customerDataLeadId)
      .execute(PROCEDURE_NAME.CRM_SEG_DATALEADS_DELETEBYDATALEADSID);
    // If store can not delete data
    if (!resultSegDataLeadsDelete.recordset[0].RESULT) {
      throw new Error(RESPONSE_MSG.CRM_SEG_DATALEADS.DELETE_FAILED);
    }

    // Create CRM_SEG_DATALEADS
    const requestSegDataLeadsCreate = new sql.Request(transaction);
    const resultSegDataLeadsCreate = await requestSegDataLeadsCreate
      .input('DATALEADSID', customerDataLeadId)
      .input('STATUSDATALEADSID', apiHelper.getValueFromObject(bodyParams, 'status_data_leads_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('SEGMENTID', apiHelper.getValueFromObject(bodyParams, 'segment_id').join('|'))
      .execute(PROCEDURE_NAME.CRM_SEG_DATALEADS_CREATE);
    // If store can not create data
    if (!resultSegDataLeadsCreate.recordset[0].RESULT) {
      throw new Error(RESPONSE_MSG.CRM_SEG_DATALEADS.CREATE_FAILED);
    }

    // Commit transaction
    await transaction.commit();

    return new ServiceResponse(true, RESPONSE_MSG.CRM_CUSTOMERDATALEADS.CREATE_SUCCESS, {
      'customer_data_lead_id': customerDataLeadId,
    });
  } catch (e) {
    // Rollback transaction
    transaction.rollback();

    // Write log
    logger.error(e, { 'function': 'customerDataLeadService.createOrUpdateCustomerDataLead' });

    return new ServiceResponse(false, e);
  }
};

const detailCustomerDataLead = async (customerDataLeadId) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('DATALEADSID', customerDataLeadId)
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GETBYID);

    let customerDataLead = data.recordsets[0];
    let taskDataLeads = data.recordsets[1];

    if (customerDataLead && customerDataLead.length) {
      customerDataLead = CustomerDataLeadClass.detail(customerDataLead[0]);
      customerDataLead.task_data_leads = TaskDataLeadClass.list(taskDataLeads);

      return new ServiceResponse(true, '', customerDataLead);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'customerDataLeadService.detailCustomerDataLead' });

    return new ServiceResponse(false, e.message);
  }
};

const deleteCustomerDataLead = async (dataDelete = {}) => {
  const pool = await mssql.pool;

  try {
    // Delete CRM_CAMPAIGN
    const resultCustomerDataLead = await pool.request()
      .input('DATALEADSID', apiHelper.getValueFromObject(dataDelete, 'customer_data_lead_id'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(dataDelete, 'updated_user'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_DELETE);

    // If store can not delete data
    if (resultCustomerDataLead.recordset.RESULT === 0) {
      throw new Error(RESPONSE_MSG.CRM_CUSTOMERDATALEADS.DELETE_FAILED);
    }

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, { 'function': 'customerDataLeadService.deleteCustomerDataLead' });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusCustomerDataLead = async (dataUpdate = {}) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('DATALEADSID', apiHelper.getValueFromObject(dataUpdate, 'customer_data_lead_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(dataUpdate, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(dataUpdate, 'user_name'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_UPDATESTATUS);

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, { 'function': 'customerDataLeadService.changeStatusCustomerDataLead' });

    return new ServiceResponse(false, e);
  }
};

const checkExistIdcard = async (idCard, customerDataLeadId = null) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DATALEADSID', customerDataLeadId)
      .input('IDCARD', idCard)
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CHECKIDCARD);

    const isExist = data.recordset[0] && data.recordset[0].RESULT;
    return new ServiceResponse(true,'', isExist);
  } catch (error) {
    logger.error(e, { 'function': 'customerDataLeadService.checkExistIdcard' });
    return new ServiceResponse(false, e);
  }
};

const checkExistPhone = async (Phone, customerDataLeadId = null) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DATALEADSID', customerDataLeadId)
      .input('PHONENUMBER', Phone)
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CHECKPHONE);

    const isExist = data.recordset[0] && data.recordset[0].RESULT;
    return new ServiceResponse(true,'', isExist);
  } catch (error) {
    logger.error(e, { 'function': 'customerDataLeadService.checkExistPhone' });
    return new ServiceResponse(false, e);
  }
};

module.exports = {
  getListCustomerDataLead,
  createCustomerDataLead,
  detailCustomerDataLead,
  updateCustomerDataLead,
  deleteCustomerDataLead,
  changeStatusCustomerDataLead,
  checkExistIdcard,
  checkExistPhone,
};
