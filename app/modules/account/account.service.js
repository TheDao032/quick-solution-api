const crmAccountClass = require('../account/account.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'account';
const config = require('../../../config/config');
/**
 * Get list CRM_ACCOUNT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCRMAccount = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
      .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
      .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
      .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
      .input('FROMBIRTHDAY', apiHelper.getValueFromObject(queryParams, 'from_birth_day'))
      .input('TOBIRTHDAY', apiHelper.getValueFromObject(queryParams, 'to_birth_day'))
      .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
      .input('TYPEREGISTER', apiHelper.getValueFromObject(queryParams, 'type_register'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETLIST_ADMINWEB);

    const Account = data.recordset;

    return new ServiceResponse(true, '', {
      'data': crmAccountClass.list(Account),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(Account),
    });
  } catch (e) {
    logger.error(e, {
      'function': 'AccountService.getListCRMAccount',
    });

    return new ServiceResponse(true, '', {});
  }
};
const createCRMAccount = async (body = {}) => {
  return await createCRMAccountOrUpdate(body);
};

const updateCRMAccount = async (body = {}, member_id) => {
  body.member_id = member_id;
  return await createCRMAccountOrUpdate(body);
};

const createCRMAccountOrUpdate = async (body = {}) => {
  let image_avatar = apiHelper.getValueFromObject(body, 'image_avatar');
  if (image_avatar) {
    const path_image_avatar = await saveFile(image_avatar, folderName);
    if (path_image_avatar) {
      image_avatar = path_image_avatar;
    }
  }
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    let data_leads_id = '';
    const requestCheck = new sql.Request(transaction);
    const resultCheck = await requestCheck
      .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CHECKEXISTS_ADMINWEB);
    if (resultCheck.recordset.lenght > 0 && resultCheck.recordset[0].DATALEADSID) {
      data_leads_id = resultCheck.recordset[0].DATALEADSID;
    } else {
      const requestCustomer = new sql.Request(transaction);
      const resultCustomer = await requestCustomer
        .input('DATALEADSID', 'WE')
        .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name'))
        .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birth_day'))
        .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
        .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
        .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
        .input('MARITALSTATUS', apiHelper.getValueFromObject(body, 'marital_status'))
        .input('IDCARD', apiHelper.getValueFromObject(body, 'id_card'))
        .input('IDCARDDATE', apiHelper.getValueFromObject(body, 'id_card_date'))
        .input('IDCARDPLACE', apiHelper.getValueFromObject(body, 'id_card_place'))
        .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
        .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
        .input('DISTRICTID', apiHelper.getValueFromObject(body, 'district_id'))
        .input('COUNTRYID', apiHelper.getValueFromObject(body, 'country_id'))
        .input('WARDID', apiHelper.getValueFromObject(body, 'ward_id'))
        .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
        .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CREATEORUPDATE_ADMINWEB);
      data_leads_id = resultCustomer.recordset[0].RESULT;
    }
    const is_change_password = apiHelper.getValueFromObject(body, 'is_change_password');
    let password = apiHelper.getValueFromObject(body, 'password');
    if (is_change_password)
      password = stringHelper.hashPassword(password);
    // Save CRM_ACCOUNT
    const requestAccount = new sql.Request(transaction);
    const resultAccount = await requestAccount
      .input('MEMBERID', apiHelper.getValueFromObject(body, 'member_id'))
      .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
      .input('DATALEADSID', data_leads_id)
      .input('PASSWORD', password)
      .input('IMAGEAVATAR', image_avatar)
      .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name'))
      .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birth_day'))
      .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
      .input('MARITALSTATUS', apiHelper.getValueFromObject(body, 'marital_status'))
      .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
      .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
      .input('IDCARD', apiHelper.getValueFromObject(body, 'id_card'))
      .input('IDCARDDATE', apiHelper.getValueFromObject(body, 'id_card_date'))
      .input('IDCARDPLACE', apiHelper.getValueFromObject(body, 'id_card_place'))
      .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
      .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
      .input('DISTRICTID', apiHelper.getValueFromObject(body, 'district_id'))
      .input('COUNTRYID', apiHelper.getValueFromObject(body, 'country_id'))
      .input('WARDID', apiHelper.getValueFromObject(body, 'ward_id'))
      .input('ISCONFIRM', apiHelper.getValueFromObject(body, 'is_confirm'))
      .input('ISCANSMSORPHONE', apiHelper.getValueFromObject(body, 'is_can_sms_or_phone'))
      .input('ISCANEMAIL', apiHelper.getValueFromObject(body, 'is_can_email'))
      .input('ISCANEMAIL', apiHelper.getValueFromObject(body, 'is_can_email'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_ACCOUNT_CREATEORUPDATE_ADMINWEB);
    const member_id = resultAccount.recordset[0].RESULT;
    if (member_id > 0) {
      removeCacheOptions();
      await transaction.commit();
    }
    return new ServiceResponse(true, '', member_id);
  } catch (error) {
    logger.error(error, {
      'function': 'AccountService.createCRMAccountOrUpdate',
    });
    console.error('AccountService.createCRMAccountOrUpdate', error);
    return new ServiceResponse(false, e.message);
  }
};

const detailCRMAccount = async (memberid) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('MEMBERID', memberid)
      .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETBYID_ADMINWEB);
    const Account = data.recordset[0];
    if (Account) {
      return new ServiceResponse(true, '', crmAccountClass.detail(Account));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      'function': 'AccountService.detailAccount',
    });

    return new ServiceResponse(false, e.message);
  }
};

const deleteCRMAccount = async (memberid, authName) => {
  const pool = await mssql.pool;
  try {
    // Delete user group
    await pool.request()
      .input('MEMBERID', memberid)
      .input('UPDATEDUSER', authName)
      .execute(PROCEDURE_NAME.CRM_ACCOUNT_DELETE_ADMINWEB);

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'AccountService.deleteAccount',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusCRMAccount = async (memberid, authName, isActive) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('MEMBERID', memberid)
      .input('ISACTIVE', isActive)
      .input('UPDATEDUSER', authName)
      .execute(PROCEDURE_NAME.CRM_ACCOUNT_UPDATESTATUS_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'AccountService.changeStatusCRMAccount',
    });

    return new ServiceResponse(false);
  }
};
const saveFile = async (base64, folderName) => {
  let url = null;

  try {
    if (fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const guid = createGuid();
      url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extension}`);
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      'function': 'AccountService.saveFile',
    });
  }
  return url;
};
const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_ACCOUNT_OPTIONS);
};

const changePassCRMAccount = async (memberid, body = {}) => {
  try {
    const pool = await mssql.pool;
    let password = apiHelper.getValueFromObject(body, 'password');
    password = stringHelper.hashPassword(password);
    await pool.request()
      .input('MEMBERID', memberid)
      .input('PASSWORD', password)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_ACCOUNT_CHANGEPASS_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'AccountService.changePassCRMAccount',
    });

    return new ServiceResponse(false);
  }
};

module.exports = {
  getListCRMAccount,
  createCRMAccount,
  updateCRMAccount,
  detailCRMAccount,
  deleteCRMAccount,
  changeStatusCRMAccount,
  changePassCRMAccount,
};
