const customerTypeClass = require('../customer-type/customer-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list CRM_CUSTOMERTYPE
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCustomerType = async (queryParams = {}) => {
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
      .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
      .input('CUSTOMERTYPEGROUPID', apiHelper.getValueFromObject(queryParams, 'customer_type_group_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type')||'2')
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active')||'2')
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_GETLIST);

    const customerTypes = data.recordset;
    return new ServiceResponse(true, '', {
      'data': customerTypeClass.list(customerTypes),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(customerTypes),
    });
  } catch (e) {
    logger.error(e, { 'function': 'customerTypeService.getListcustomerType' });

    return new ServiceResponse(true, '', {});
  }
};

const createCustomerTypeOrUpdate = async (body = {}) => {
  const pool = await mssql.pool;
  try {
    // Save 
    const data = await pool.request()
      .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(body, 'customer_type_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(body, 'business_id'))
      .input('CUSTOMERTYPENAME', apiHelper.getValueFromObject(body, 'customer_type_name'))
      .input('CUSTOMERTYPEGROUPID', apiHelper.getValueFromObject(body, 'customer_type_group_id'))
      .input('COLOR', apiHelper.getValueFromObject(body, 'color'))
      .input('NOTECOLOR', apiHelper.getValueFromObject(body, 'note_color'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(body, 'order_index'))
      .input('ISMEMBERTYPE', apiHelper.getValueFromObject(body, 'is_member_type'))
      .input('ISSELL', apiHelper.getValueFromObject(body, 'is_sell'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_CREATEORUPDATE);
    removeCacheOptions();
    return new ServiceResponse(true, '',data.recordset[0].RESULT);
  } catch (error) {
    logger.error(error, { 'customerType': 'customerTypeService.createCustomerTypeOrUpdate' });
    console.error('customerTypeService.createCustomerTypeOrUpdate', error);
    return new ServiceResponse(false, e.message);
  }
};

const detailCustomerType = async (customer_type_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('CUSTOMERTYPEID', customer_type_id)
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_GETBYID);
    const customerType = data.recordset[0];
    if (customerType) {
      return new ServiceResponse(true, '', customerTypeClass.detail(customerType));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, { 'function': 'customerTypeService.detailcustomerType' });

    return new ServiceResponse(false, e.message);
  }
};

const deleteCustomerType = async (customer_type_id, bodyParams) => {
  const pool = await mssql.pool;
  try {
    // Delete user group
    await pool.request()
      .input('CUSTOMERTYPEID', customer_type_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_DELETE);

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, { 'function': 'customerTypeService.deletecustomerType' });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const checkUsedCustomerType = async (customer_type_id) => {
  const pool = await mssql.pool;
  try {
    // Delete user group
    const data = await pool.request()
      .input('CUSTOMERTYPEID', customer_type_id)
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_CHECKUSED);
    return new ServiceResponse(true, '',data.recordset[0].RESULT);

  } catch (e) {
    logger.error(e, { 'function': 'customerTypeService.checkUsedCustomerType' });
    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
const changeStatusCustomerType = async (customer_type_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('CUSTOMERTYPEID', customer_type_id)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, { 'function': 'customerTypeService.changeStatuscustomerType' });

    return new ServiceResponse(false);
  }
};
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_CUSTOMERTYPE_OPTIONS);
};

module.exports = {
  getListCustomerType,
  createCustomerTypeOrUpdate,
  detailCustomerType,
  deleteCustomerType,
  changeStatusCustomerType,
  checkUsedCustomerType,
};
