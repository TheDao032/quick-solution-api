const bookingClass = require('../booking/booking.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const CACHE_CONST = require('../../common/const/cache.const');
const cacheHelper = require('../../common/helpers/cache.helper');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListBooking = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('BOOKINGDATEFROM', apiHelper.getValueFromObject(queryParams, 'booking_date_from'))
      .input('BOOKINGDATETO', apiHelper.getValueFromObject(queryParams, 'booking_date_to'))
      .input('BOOKINGSTATUSID', apiHelper.getValueFromObject(queryParams, 'booking_status_id'))
      .execute(PROCEDURE_NAME.SL_BOOKING_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': bookingClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'bookingService.getListBooking'});
    return new ServiceResponse(true, '', {});
  }
};

const getListAllBooking = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute(PROCEDURE_NAME.SL_BOOKING_GETLISTALL_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': bookingClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'bookingService.getListAllBooking'});
    return new ServiceResponse(true, '', {});
  }
};

const getListBookingDetail = async (bookingId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BOOKINGID', bookingId)
      .execute(PROCEDURE_NAME.SL_BOOKINGDETAIL_GETLISTBYBOOKINGID_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': bookingClass.listBookingDetail(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'bookingService.getListBookingDetail'});
    return new ServiceResponse(true, '', {});
  }
};

const getListProduct = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('STRCATEGORYID', apiHelper.getValueFromObject(queryParams, 'str_category_id'))
      .input('STRMANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'str_manufacturer_id'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': bookingClass.listProduct(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'bookingService.getListProduct'});
    return new ServiceResponse(true, '', {});
  }
};

const detailBooking = async (bookingId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BOOKINGID', bookingId)
      .execute(PROCEDURE_NAME.SL_BOOKING_GETBYID_ADMINWEB);

    let booking = data.recordset;

    if (booking && booking.length>0) {
      booking = bookingClass.detail(booking[0]);
      return new ServiceResponse(true, '', booking);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.detailBooking'});
    return new ServiceResponse(false, e.message);
  }
};

const createBookingOrUpdate = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const list_booking_detail = apiHelper.getValueFromObject(bodyParams, 'list_booking_detail');

    //if(list_booking_detail && list_booking_detail.length > 0)
    //{
    //  for(let i = 0; i < list_booking_detail.length; i++)
    //  {
    //    const item = list_booking_detail[i];
    //    totalMoney += apiHelper.getValueFromObject(item, 'total_price_item');
    //  }
    //}

    // check update
    const id = apiHelper.getValueFromObject(bodyParams, 'booking_id');
    if(id && id !== '')
    {
      // if update -> delete table SL_BOOKINGDETAIL
      const requestBookingDetailDelete = new sql.Request(transaction);
      const dataBookingDetailDelete = await requestBookingDetailDelete
        .input('BOOKINGID', id)
        .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute(PROCEDURE_NAME.SL_BOOKINGDETAIL_DELETE_ADMINWEB);
      const resultDelete = dataBookingDetailDelete.recordset[0].RESULT;
      if(resultDelete <= 0)
      {
        return new ServiceResponse(false,RESPONSE_MSG.BOOKING.UPDATE_FAILED);
      }
    }

    // create table SL_BOOKINGDETAIL
    if(list_booking_detail && list_booking_detail.length > 0)
    {
      for(let i = 0;i < list_booking_detail.length;i++) {
        const item = list_booking_detail[i];
        const requestBookingDetailCreate = new sql.Request(transaction);
        const dataBookingDetailCreate = await requestBookingDetailCreate // eslint-disable-line no-await-in-loop
          .input('BOOKINGID', apiHelper.getValueFromObject(bodyParams, 'booking_id'))
          .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .input('BOOKINGDETAILID', apiHelper.getValueFromObject(item, 'booking_detail_id'))
          .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
          .input('PRODUCTNAME', apiHelper.getValueFromObject(item, 'product_name'))
          .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
          .input('PRICE', apiHelper.getValueFromObject(item, 'price'))
          .input('TOTALPRICEITEM', apiHelper.getValueFromObject(item, 'total_price_item'))
          .execute(PROCEDURE_NAME.SL_BOOKINGDETAIL_INSERTORUPDATE_ADMINWEB);
        const bookingDetailId = dataBookingDetailCreate.recordset[0].RESULT;
        if(bookingDetailId <= 0)
        {
          return new ServiceResponse(false,RESPONSE_MSG.TASK.CREATE_FAILED);
        }
      }
    }

    const data = await pool.request()
      .input('BOOKINGID', apiHelper.getValueFromObject(bodyParams, 'booking_id'))
      .input('BOOKINGSTATUSID', apiHelper.getValueFromObject(bodyParams, 'booking_status_id'))
      .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_BOOKING_CREATEORUPDATE_ADMINWEB);
    const bookingId= data.recordset[0].RESULT;
    if(bookingId <= 0)
    {
      return new ServiceResponse(false,RESPONSE_MSG.BOOKING.CREATE_FAILED);
    }

    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true,'',bookingId);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.createBookingOrUpdate'});
    return new ServiceResponse(false);
  }
};

const createOrderOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
      //.input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
      //.input('CONTRACTID', apiHelper.getValueFromObject(bodyParams, 'contract_id'))
      //.input('ISCONTRACTORDER', apiHelper.getValueFromObject(bodyParams, 'is_contract_order'))
      .input('BOOKINGID', apiHelper.getValueFromObject(bodyParams, 'booking_id'))
      //.input('ORDERNO', apiHelper.getValueFromObject(bodyParams, 'order_no'))
      //.input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
      //.input('SUBTOTAL', apiHelper.getValueFromObject(bodyParams, 'sub_total'))
      //.input('TOTALDISCOUNT', apiHelper.getValueFromObject(bodyParams, 'total_discount'))
      //.input('TOTALVAT', apiHelper.getValueFromObject(bodyParams, 'total_vat'))
      //.input('TOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'total_money'))
      //.input('ORDERDATE', apiHelper.getValueFromObject(bodyParams, 'order_date'))
      //.input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
      //.input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      //.input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_ORDER_CREATEORUPDATE_ADMINWEB);
    const orderId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',orderId);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.createOrderOrUpdate'});
    return new ServiceResponse(false);
  }
};

const createOrderDetailOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('ORDERDETAILID', apiHelper.getValueFromObject(bodyParams, 'order_detail_id'))
      .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
      .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
      .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'out_put_type_id'))
      .input('QUANTITY', apiHelper.getValueFromObject(bodyParams, 'quantity'))
      .input('PRICE', apiHelper.getValueFromObject(bodyParams, 'price'))
      .input('VATAMOUNT', apiHelper.getValueFromObject(bodyParams, 'vat_amount'))
      .input('TOTALAMOUNT', apiHelper.getValueFromObject(bodyParams, 'total_amount'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_ORDERDETAIL_CREATEORUPDATE_ADMINWEB);
    const orderId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',orderId);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.createOrderDetailOrUpdate'});
    return new ServiceResponse(false);
  }
};

const createOrderPromotionOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('ORDERPROMOTIONID', apiHelper.getValueFromObject(bodyParams, 'order_promotion_id'))
      .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
      .input('PROMOTIONID', apiHelper.getValueFromObject(bodyParams, 'promotion_id'))
      .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
      .input('PROMOTIONOFFERAPPLYID', apiHelper.getValueFromObject(bodyParams, 'promotion_offer_apply_id'))
      .input('PRODUCTGIFTSID', apiHelper.getValueFromObject(bodyParams, 'product_gifts_id'))
      //.input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      //.input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SM_ORDERPROMOTION_CREATEORUPDATE_ADMINWEB);
    const orderId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',orderId);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.createOrderPromotionOrUpdate'});
    return new ServiceResponse(false);
  }
};

const createListBookingDetailOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BOOKINGID', apiHelper.getValueFromObject(bodyParams, 'booking_id'))
      .input('COOKIEID', apiHelper.getValueFromObject(bodyParams, 'cookie_id'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_BOOKINGDETAIL_INSERTLIST_ADMINWEB);
    const bookingDetailId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',bookingDetailId);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.createListBookingDetailOrUpdate'});
    return new ServiceResponse(false);
  }
};

const createCartOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
      .input('COOKIEID', apiHelper.getValueFromObject(bodyParams, 'cookie_id'))
      .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
      .input('QUANTITY', apiHelper.getValueFromObject(bodyParams, 'quantity'))
      .input('PRICE', apiHelper.getValueFromObject(bodyParams, 'price'))
      .input('TOTALPRICEITEM', apiHelper.getValueFromObject(bodyParams, 'total_price_item'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_CART_CREATE_ADMINWEB);
    const cookieId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',cookieId);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.createCartOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusBooking = async (bookingId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('BOOKINGID',bookingId)
      .input('BOOKINGSTATUSID', apiHelper.getValueFromObject(bodyParams, 'booking_status_id'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_BOOKING_CHANGESTATUS_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.BOOKING.CHANGE_STATUS_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.cancelBooking'});
    return new ServiceResponse(false, e.message);
  }
};

const deleteBooking = async (bookingId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('BOOKINGID',bookingId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.SL_BOOKING_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.BOOKING.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'bookingService.deleteBooking'});
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

module.exports = {
  getListBooking,
  detailBooking,
  createBookingOrUpdate,
  deleteBooking,
  getListBookingDetail,
  getListProduct,
  createListBookingDetailOrUpdate,
  createCartOrUpdate,
  getListAllBooking,
  changeStatusBooking,
  createOrderOrUpdate,
  createOrderDetailOrUpdate,
  createOrderPromotionOrUpdate,
};
