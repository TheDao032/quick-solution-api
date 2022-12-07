const contractClass = require('../contract/contract.class');
const customerDataLeadClass = require('../customer-data-lead/customer-data-lead.class');
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
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const stringHelper = require('../../common/helpers/string.helper');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'contract';
const config = require('../../../config/config');
const nodemailer = require('nodemailer');

const createContractOrUpdate = async (bodyParams) => {
  const pool = await mssql.pool;
  let member_id =0;
  let account ;
  const data = await pool.request()
    .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
    .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETBYDATALEADSID);
  if (data.recordset && data.recordset.length) {
    member_id = data.recordset[0].MEMBERID;
  }
  else{
    const dataDataLeads = await pool.request()
      .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GETBYID);
    let customerDataLead = dataDataLeads.recordsets[0];
    if (customerDataLead && customerDataLead.length) {
      customerDataLead = customerDataLeadClass.detail(customerDataLead[0]);
      const password=createPasword();
      account = {
        user_name : customerDataLead.phone_number,
        password : stringHelper.hashPassword(password),
        password_not_hash : password,
        data_leads_id : customerDataLead.data_leads_id,
        business_id : customerDataLead.business_id,
        full_name : customerDataLead.full_name,
        birthday : customerDataLead.birthday,
        gender : customerDataLead.gender,
        marital_status : customerDataLead.marital_status,
        phone_number : customerDataLead.phone_number,
        email : customerDataLead.email,
        id_card : customerDataLead.id_card,
        id_card_date : customerDataLead.id_card_date,
        id_card_place : customerDataLead.id_card_place,
        country_id : customerDataLead.country_id,
        province_id : customerDataLead.province_id,
        district_id : customerDataLead.district_id,
        ward_id : customerDataLead.ward_id,
        address : customerDataLead.address,
        is_confirm : 1,
        is_active : 1,
        is_system : 0,
      };
    }
  }
  const order_detais = apiHelper.getValueFromObject(bodyParams, 'order_detais');
  let total_month = 0;
  let product_ids = '';
  for (let i = 0; i < order_detais.length; i++) {
    product_ids += (product_ids ? '|' : '') + apiHelper.getValueFromObject(order_detais[i], 'product_id');
  }
  const dataTotalMonth = await pool.request()
    .input('PRODUCTID', product_ids)
    .execute(PROCEDURE_NAME.PRO_PRODUCTSERVICES_GETTOTALMONTH);
  if (dataTotalMonth.recordset && dataTotalMonth.recordset.length) {
    total_month = dataTotalMonth.recordset[0].RESULT||0;
  }
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    if(!member_id) {
      // Save CRM_ACCOUNT
      const requestAccount = new sql.Request(transaction);
      const resultAccount = await requestAccount
        .input('MEMBERID', apiHelper.getValueFromObject(account, 'member_id'))
        .input('USERNAME', apiHelper.getValueFromObject(account, 'user_name'))
        .input('DATALEADSID', apiHelper.getValueFromObject(account, 'data_leads_id'))
        .input('PASSWORD', apiHelper.getValueFromObject(account, 'password'))
        .input('IMAGEAVATAR', apiHelper.getValueFromObject(account, 'image_avatar'))
        .input('FULLNAME', apiHelper.getValueFromObject(account, 'full_name'))
        .input('BIRTHDAY', apiHelper.getValueFromObject(account, 'birth_day'))
        .input('GENDER', apiHelper.getValueFromObject(account, 'gender'))
        .input('MARITALSTATUS', apiHelper.getValueFromObject(account, 'marital_status'))
        .input('PHONENUMBER', apiHelper.getValueFromObject(account, 'phone_number'))
        .input('EMAIL', apiHelper.getValueFromObject(account, 'email'))
        .input('IDCARD', apiHelper.getValueFromObject(account, 'id_card'))
        .input('IDCARDDATE', apiHelper.getValueFromObject(account, 'id_card_date'))
        .input('IDCARDPLACE', apiHelper.getValueFromObject(account, 'id_card_place'))
        .input('ADDRESS', apiHelper.getValueFromObject(account, 'address'))
        .input('PROVINCEID', apiHelper.getValueFromObject(account, 'province_id'))
        .input('DISTRICTID', apiHelper.getValueFromObject(account, 'district_id'))
        .input('COUNTRYID', apiHelper.getValueFromObject(account, 'country_id'))
        .input('WARDID', apiHelper.getValueFromObject(account, 'ward_id'))
        .input('ISCONFIRM', apiHelper.getValueFromObject(account, 'is_confirm'))
        .input('ISCANSMSORPHONE', apiHelper.getValueFromObject(account, 'is_can_sms_or_phone'))
        .input('ISCANEMAIL', apiHelper.getValueFromObject(account, 'is_can_email'))
        .input('ISSYSTEM', apiHelper.getValueFromObject(account, 'is_system'))
        .input('ISACTIVE', apiHelper.getValueFromObject(account, 'is_active'))
        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute(PROCEDURE_NAME.CRM_ACCOUNT_CREATEORUPDATE_ADMINWEB);
      member_id = resultAccount.recordset[0].RESULT;
      if (member_id <=0) {
        return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.CREATE_FAILED);
      }
      if(account.email)
        await sendMail('RUBY FITNESS',account.email,'Đăng ký tài khoản tự động','Đăng ký tài khoản tự động thành công: ',
          '<ul><li>Tài khoản:' + account.user_name + '</li><li>Mật khẩu:' + account.password_not_hash + '</li></ul>');
    }
    const requestContract = new sql.Request(transaction);
    const resultContract = await requestContract // eslint-disable-line no-await-in-loop
      .input('CONTRACTID', apiHelper.getValueFromObject(bodyParams, 'contract_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('CONTRACTTYPEID', apiHelper.getValueFromObject(bodyParams, 'contract_type_id'))
      .input('ISRENEW', apiHelper.getValueFromObject(bodyParams, 'is_renew'))
      .input('TOTALVALUE', apiHelper.getValueFromObject(bodyParams, 'total_value'))
      .input('ACTIVEDATE', apiHelper.getValueFromObject(bodyParams, 'active_date'))
      .input('TOTALMONTH', total_month)
      .input('MEMBERID', member_id)
      .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
      .input('NOTEHEALTHY', apiHelper.getValueFromObject(bodyParams, 'note_healthy'))
      .input('PURPOSE', apiHelper.getValueFromObject(bodyParams, 'purpose'))
      .input('ISAGREE', apiHelper.getValueFromObject(bodyParams, 'is_agree'))
      .input('FULLNAMEGUARDIAN', apiHelper.getValueFromObject(bodyParams, 'full_name_guardian'))
      .input('RELATIONSHIPMEMBERID', apiHelper.getValueFromObject(bodyParams, 'relation_ship_member_id'))
      .input('FULLADDRESSGUARDIAN', apiHelper.getValueFromObject(bodyParams, 'full_address_guardian'))
      .input('GUARDIANEMAIL', apiHelper.getValueFromObject(bodyParams, 'guardian_email'))
      .input('GUARDIANIDCARD', apiHelper.getValueFromObject(bodyParams, 'guardian_id_card'))
      .input('GUARDIANPHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'guardian_phone_number'))
      .input('CONTRACTSTATUS', 2)
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CT_CONTRACT_CREATEORUPDATE);
    const contract_id = resultContract.recordset[0].RESULT;
    if (contract_id <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.CREATE_FAILED);
    }
    const requestOrder = new sql.Request(transaction);
    const resultOrder = await requestOrder // eslint-disable-line no-await-in-loop
      .input('CONTRACTID', contract_id)
      .input('MEMBERID', member_id)
      .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
      .input('SUBTOTAL', apiHelper.getValueFromObject(bodyParams, 'sub_total'))
      .input('TOTALVAT', apiHelper.getValueFromObject(bodyParams, 'total_vat'))
      .input('TOTALDISCOUNT', apiHelper.getValueFromObject(bodyParams, 'total_discount'))
      .input('TOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'total_money'))
      .input('ISACTIVE', '0')
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_ORDER_CREATEORUPDATE);
    const order_id = resultOrder.recordset[0].RESULT;
    if (order_id <= 0) {
      return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.CREATE_FAILED);
    }
    const requestOrderDetailDelete = new sql.Request(transaction);
    const resultOrderDetailDelete = await requestOrderDetailDelete // eslint-disable-line no-await-in-loop
      .input('ORDERID', order_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_ORDERDETAIL_DELETE);
    if (resultOrderDetailDelete.recordset[0].RESULT !== 1) {
      return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.CREATE_FAILED);
    }
    const requestOrderPromotionDelete = new sql.Request(transaction);
    const resultOrderPromotionDelete = await requestOrderPromotionDelete // eslint-disable-line no-await-in-loop
      .input('ORDERID', order_id)
      .execute(PROCEDURE_NAME.SM_ORDERPROMOTION_DELETE);
    if (resultOrderPromotionDelete.recordset[0].RESULT !== 1) {
      return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.CREATE_FAILED);
    }
    const order_detais =apiHelper.getValueFromObject(bodyParams,'order_detais');
    if(order_detais && order_detais.length) {
      for(let i = 0;i < order_detais.length;i++) {
        const item = order_detais[i];
        const requestOrderDetail = new sql.Request(transaction);
        const resultOrderDetail = await requestOrderDetail // eslint-disable-line no-await-in-loop
          .input('ORDERID', order_id)
          .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
          .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
          .input('PRICE', apiHelper.getValueFromObject(item, 'price'))
          .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
          .input('TOTALDISCOUNT', apiHelper.getValueFromObject(item, 'total_discount'))
          .input('VATAMOUNT', apiHelper.getValueFromObject(item, 'vat_amount'))
          .input('TOTALAMOUNT', apiHelper.getValueFromObject(item, 'total_amount'))
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .execute(PROCEDURE_NAME.SL_ORDERDETAIL_CREATE);
        if (resultOrderDetail.recordset[0].RESULT <= 0) {
          return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.CREATE_FAILED);
        }

        const requestOrderPromotion = new sql.Request(transaction);
        const resultOrderPromotion = await requestOrderPromotion // eslint-disable-line no-await-in-loop
          .input('ORDERID', order_id)
          .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
          .input('PROMOTIONID', apiHelper.getValueFromObject(item, 'promotion_id'))
          .execute(PROCEDURE_NAME.SM_ORDERPROMOTION_CREATE);
        if (resultOrderPromotion.recordset[0].RESULT <= 0) {
          return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.CREATE_FAILED);
        }
      }
    }

    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true,'',contract_id);
  } catch (e) {
    logger.error(e, {'function': 'contractService.createContractOrUpdate'});
    await transaction.rollback();
    // Return error
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return;
  //return cacheHelper.removeByKey(CACHE_CONST.CRM_CONTRACT_OPTIONS);
};

const getListContract = async function (queryParams) {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('CONTRACTTYPEID', apiHelper.getValueFromObject(queryParams, 'contract_type_id'))
      .input('ISRENEW', apiHelper.getValueFromObject(queryParams, 'is_renew'))
      .input('ISPAY', apiHelper.getValueFromObject(queryParams, 'is_pay'))
      .input('CONTRACTSTATUS', apiHelper.getValueFromObject(queryParams, 'contract_status'))
      .execute(PROCEDURE_NAME.CT_CONTRACT_GETLIST);

    const campaignStatus = data.recordset;

    return new ServiceResponse(true, '', {
      'data': contractClass.list(campaignStatus),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(campaignStatus),
    });
  } catch (e) {
    logger.error(e, {'function': 'ContractService.getListContract'});
    return new ServiceResponse(true, '', {});
  }
};

const detailContract = async (contractId,is_full_info = 0) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CONTRACTID', contractId)
      .execute(PROCEDURE_NAME.CT_CONTRACT_GETBYID);

    let contract = data.recordset;
    if (contract && contract.length) {
      contract = contractClass.detail(contract[0]);
      if(is_full_info) {
        const orderdata = await pool.request()
          .input('CONTRACTID', contractId)
          .execute(PROCEDURE_NAME.SL_ORDER_GETBYCONTRACTID);
        if (orderdata.recordset && orderdata.recordset.length) {
          let order = contractClass.detailOrder(orderdata.recordset[0]);
          contract = Object.assign(contract, order);
          let order_detais=[];
          const orderDetaildata = await pool.request()
            .input('ORDERID', order.order_id)
            .execute(PROCEDURE_NAME.SL_ORDERDETAIL_GETLISTBYORDERID);
          if (orderDetaildata.recordset && orderDetaildata.recordset.length) {
            order_detais = contractClass.listOrderDetail(orderDetaildata.recordset);
          }
          const orderPromotiondata = await pool.request()
            .input('ORDERID', order.order_id)
            .execute(PROCEDURE_NAME.SM_ORDERPROMOTION_GETLISTBYORDERID);
          if (orderPromotiondata.recordset && orderPromotiondata.recordset.length) {
            const promotions = contractClass.listOrderPromotion(orderPromotiondata.recordset);
            order_detais = order_detais.map((data) => {
              if(promotions.find((x) => x.order_id === data.order_id))
                data = Object.assign(data, promotions.find((x) => x.order_id === data.order_id));
              return data;
            });
          }
          contract.order_detais = order_detais;
        }

        const documentdata = await pool.request()
          .input('CONTRACTID', contractId)
          .execute(PROCEDURE_NAME.CRM_DOCFILEATTACHMENT_GETLIST);
        if (documentdata.recordset && documentdata.recordset.length) {
          let documents = contractClass.listDocument(documentdata.recordset);
          contract.documents = documents;
        }
      }
      return new ServiceResponse(true, '', contract);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'ContractService.detailContract'});

    return new ServiceResponse(false, e.message);
  }
};

const deleteContract = async (contractId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    const resultContract = await pool.request()
      .input('CONTRACTID', contractId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CT_CONTRACT_DELETE);

    if (resultContract.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.CONTRACT.DELETE_FAILED);
    }

    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.CONTRACT.DELETE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'ContractService.deleteContract'});
    return new ServiceResponse(false, e.message);
  }
};

const approvedContract = async (contractId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    const resultContract = await pool.request()
      .input('CONTRACTID', contractId)
      .input('CONTRACTSTATUS', apiHelper.getValueFromObject(bodyParams, 'contract_status'))
      .input('USERAPPROVED', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CT_CONTRACT_APPROVED);

    if (resultContract.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.CONTRACT.APPROVED_FAILED);
    }

    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.CONTRACT.APPROVED_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'ContractService.approvedContract'});
    return new ServiceResponse(false, e.message);
  }
};
const transferContract = async (contractId, bodyParams) => {
  try {

    const pool = await mssql.pool;
    const resultContract = await pool.request()
      .input('CONTRACTID', contractId)
      .input('MEMBERTRANFER', apiHelper.getValueFromObject(bodyParams, 'member_transfer'))
      .input('MEMBERRECEIVE', apiHelper.getValueFromObject(bodyParams, 'member_receive'))
      .input('TRANSFERNOTE', apiHelper.getValueFromObject(bodyParams, 'transfer_note'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CT_CONTRACT_TRANSFER);

    if (resultContract.recordset[0].RESULT === 0) {
      throw new Error(RESPONSE_MSG.CONTRACT.TRANSFER_FAILED);
    }

    removeCacheOptions();
    return new ServiceResponse(true, RESPONSE_MSG.CONTRACT.TRANSFER_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'ContractService.transferContract'});
    return new ServiceResponse(false, e.message);
  }
};
const freezeContract = async (contractId,contracttypeId, bodyParams) => {
  try {
    let documents =apiHelper.getValueFromObject(bodyParams,'documents');
    if(documents && documents.length) {
      for(let i = 0;i < documents.length;i++) {
        let attachment_path = documents[i].attachment_path;
        if (attachment_path) {
          // eslint-disable-next-line no-await-in-loop
          const path = await saveFile(attachment_path, folderName);
          if (path) {
            documents[i].attachment_path = path;
          }
          else{
            return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.FREEZE_FAILED);
          }
        }
      }
    }
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
      const requestContract = new sql.Request(transaction);
      const resultContract = await requestContract // eslint-disable-line no-await-in-loop
        .input('CONTRACTID', contractId)
        .input('STARTDATEFREEZE', apiHelper.getValueFromObject(bodyParams, 'start_date_freeze'))
        .input('ENDDATEFREEZE', apiHelper.getValueFromObject(bodyParams, 'end_date_freeze'))
        .input('DOCUMENTID', apiHelper.getValueFromObject(bodyParams, 'document_id'))
        .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute(PROCEDURE_NAME.CT_CONTRACT_FREEZE);

      if (resultContract.recordset[0].RESULT !== 1) {
        return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.FREEZE_FAILED);
      }
      const requestDocumentDelete = new sql.Request(transaction);
      const resultDocumentDelete = await requestDocumentDelete // eslint-disable-line no-await-in-loop
        .input('CONTRACTID', contractId)
        .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute(PROCEDURE_NAME.CRM_DOCFILEATTACHMENTL_DELETE);
      if (resultDocumentDelete.recordset[0].RESULT !== 1) {
        return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.FREEZE_FAILED);
      }
      if(documents && documents.length) {
        for(let i = 0;i < documents.length;i++) {
          const item = documents[i];
          const requestDocument = new sql.Request(transaction);
          const resultDocument = await requestDocument // eslint-disable-line no-await-in-loop
            .input('CONTRACTID', contractId)
            .input('CONTRACTTYPEID', contracttypeId)
            .input('ATTACHMENTNAME', apiHelper.getValueFromObject(item, 'attachment_name'))
            .input('ATTACHMENTPATH', apiHelper.getValueFromObject(item, 'attachment_path'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_DOCFILEATTACHMENT_CREATE);
          if (resultDocument.recordset[0].RESULT <= 0) {
            return new ServiceResponse(false,RESPONSE_MSG.CONTRACT.FREEZE_FAILED);
          }
        }
      }
    } catch (e) {
      logger.error(e, {'function': 'contractService.freezeContract'});
      await transaction.rollback();
      // Return error
      return new ServiceResponse(false, e.message);
    }
    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true, RESPONSE_MSG.CONTRACT.FREEZE_SUCCESS);
  } catch (e) {
    logger.error(e, {'function': 'ContractService.freezeContract'});
    return new ServiceResponse(false, e.message);
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
      'function': 'bannerService.saveFile',
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
const createPasword = () => {
  return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
const getProductInfo = async (bodyParams) => {
  try {
    const list_product = apiHelper.getValueFromObject(bodyParams, 'list_product');
    let list_product_result=[];
    const pool = await mssql.pool;
    if(list_product && list_product.length > 0)
    {
      for(let i = 0;i < list_product.length;i++) {
        const item = list_product[i];
        const data = await pool.request() // eslint-disable-line no-await-in-loop
          .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
          .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type'))
          .input('PROMOTIONID', apiHelper.getValueFromObject(item, 'promotion_id'))
          .input('PROMOTIONOFFERAPPLYID', apiHelper.getValueFromObject(item, 'promotion_offer_apply_id'))
          .execute(PROCEDURE_NAME.MD_PRODUCT_GetInforContract);
        const info = data.recordset[0];
        list_product_result.push(contractClass.productInfo(info));
      }
    }

    return new ServiceResponse(true, '', list_product_result);
  } catch (e) {
    logger.error(e, {
      'function': 'ContractService.getListProductInfo',
    });
    return new ServiceResponse(false, e.message);
  }
};
const sendMail = async (from,to,subject,text,html) => {
  try {
    var transporter = nodemailer.createTransport({ // config mail server
      service: 'Gmail',
      auth: {
        user: config.sendGmail.user,
        pass: config.sendGmail.pass,
      },
    });
    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };
    transporter.sendMail(mainOptions, (err, info) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log('Message sent: ' + info.response);
        return true;
      }
    });

    return true;
  } catch (e) {
    logger.error(e, {
      'function': 'ContractService.sendMail',
    });
    return false;
  }
};
module.exports = {
  createContractOrUpdate,
  getListContract,
  detailContract,
  deleteContract,
  approvedContract,
  transferContract,
  freezeContract,
  getProductInfo,
};
