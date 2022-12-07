/* eslint-disable no-await-in-loop */
const commentClass = require('../comment/comment.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const fileHelper = require('../../common/helpers/file.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const config = require('../../../config/config');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListComment = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.PRO_COMMENT_GETLIST_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': commentClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'commentService.getListComment'});
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
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
      .input('STATUSPRODUCTID', apiHelper.getValueFromObject(queryParams, 'status_product_id'))
      .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
      .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .input('ISSHOWWEB', apiHelper.getFilterBoolean(queryParams, 'is_show_web'))
      .input('ISSERVICE', apiHelper.getFilterBoolean(queryParams, 'is_serivce'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('USERID', apiHelper.getValueFromObject(queryParams, 'auth_id'))
      .execute(PROCEDURE_NAME.PRO_COMMENT_GETLISTPRODUCT_ADMINWEB);

    const dataRecord = data.recordset;
    let products = commentClass.listProduct(dataRecord);
    for (let i = 0; i < products.length; i++) {
      const dataBus = await pool.request() // eslint-disable-next-line no-await-in-loop
        .input('PRODUCTID', apiHelper.getValueFromObject(products[i], 'product_id'))
        .execute(PROCEDURE_NAME.MD_PRODUCT_BUSINESS_GETLISTBYPRODUCTID);
      const dataRecordBus = dataBus.recordset;
      products[i].businesses = [];
      if(dataRecordBus) {
        products[i].businesses = commentClass.listBussiness(dataRecordBus);
      }
    }
    return new ServiceResponse(true, '', {
      'data': products,
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(dataRecord),
    });
  } catch (e) {
    logger.error(e, {
      'function': 'ProductService.getListProduct',
    });
    return new ServiceResponse(false, e.message);
  }
};

const detailComment = async (commentId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTCOMMENTID', commentId)
      .execute(PROCEDURE_NAME.PRO_COMMENT_GETBYID_ADMINWEB);

    let comment = data.recordset;
    // If exists news category
    if (comment && comment.length>0) {
      comment = commentClass.detailComment(comment[0]);
      return new ServiceResponse(true, '', comment);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'commentService.detailComment'});
    return new ServiceResponse(false, e.message);
  }
};

const detailProduct = async (product_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('PRODUCTID', product_id)
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETBYID);
    if (data.recordsets && data.recordsets.length > 0) {
      if (data.recordsets[0].length > 0) {
        const products = data.recordsets[0];
        const pictures = data.recordsets[1];
        let record = commentClass.detailProduct(products[0]);
        record.pictures = commentClass.listPicture(pictures);
        const businesses = data.recordsets[2];
        record.businesses = commentClass.listBussiness(businesses);
        if (record.is_service < 1) {
          const attribute_values = data.recordsets[3];
          record.attribute_values = commentClass.listAttributeValues(attribute_values);
        } else {
          const services = data.recordsets[4];
          if (data.recordsets[4].length > 0) {
            const service = commentClass.detailService(services[0]);
            record = Object.assign(record, service);
          }
        }
        return new ServiceResponse(true, '', record);
      }
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {
      'function': 'commentService.detailProduct',
    });

    return new ServiceResponse(false, e.message);
  }
};

const detailCommentReply = async (commentId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTCOMMENTID', commentId)
      .execute(PROCEDURE_NAME.PRO_COMMENTREPLY_GETBYID_ADMINWEB);

    let commentReply = data.recordset;
    // If exists news category
    if (commentReply && commentReply.length>0) {
      commentReply = commentClass.detailCommentReply(commentReply[0]);
      return new ServiceResponse(true, '', commentReply);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'commentService.detailCommentReply'});
    return new ServiceResponse(false, e.message);
  }
};

const createCommentOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('PRODUCTCOMMENTID', apiHelper.getValueFromObject(bodyParams, 'product_comment_id'))
      .input('CONTENTCOMMENT', apiHelper.getValueFromObject(bodyParams, 'content_comment'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_COMMENT_CREATEORUPDATE_ADMINWEB);
    const commentId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',commentId);
  } catch (e) {
    logger.error(e, {'function': 'commentService.createCommentOrUpdate'});
    return new ServiceResponse(false);
  }
};

const createCommentReplyOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
      .input('PRODUCTCOMMENTID', apiHelper.getValueFromObject(bodyParams, 'product_comment_id'))
      .input('CONTENTCOMMENT', apiHelper.getValueFromObject(bodyParams, 'content_comment'))
      .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
      .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email'))
      .input('USERCOMMENT', apiHelper.getValueFromObject(bodyParams, 'user_comment'))
      .input('FULLNAME', apiHelper.getValueFromObject(bodyParams, 'full_name'))
      .input('ISSTAFF', apiHelper.getValueFromObject(bodyParams, 'is_staff'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_COMMENTREPLY_CREATEORUPDATE_ADMINWEB);
    const commentReplyId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',commentReplyId);
  } catch (e) {
    logger.error(e, {'function': 'commentService.createCommentReplyOrUpdate'});
    return new ServiceResponse(false);
  }
};

const deleteComment = async (commentId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PRODUCTCOMMENTID',commentId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_COMMENT_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.COMMENT.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'commentService.deleteComment'});
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListComment,
  detailComment,
  detailCommentReply,
  createCommentOrUpdate,
  createCommentReplyOrUpdate,
  deleteComment,
  getListProduct,
  detailProduct,
};
