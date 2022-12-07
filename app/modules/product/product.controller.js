const productService = require('./product.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list 
 */
const getListProduct = async (req, res, next) => {
  try {
    req.query.auth_id = req.body.auth_id;
    const serviceRes = await productService.getListProduct(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail 
 */
const detailProduct = async (req, res, next) => {
  try {
    const productId = req.params.product_id;
    const serviceRes = await productService.detailProduct(productId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createProduct = async (req, res, next) => {
  try {
    req.body.product_id = null;
    const serviceRes = await productService.createProductOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PRODUCT.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update 
 */
const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.product_id;
    req.body.product_id = productId;

    // Check exists
    const serviceResDetail = await productService.detailProduct(productId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update 
    const serviceRes = await productService.createProductOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PRODUCT.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusProduct = async (req, res, next) => {
  try {
    const productId = req.params.product_id;
    // Check exists
    const serviceResDetail = await productService.detailProduct(productId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await productService.changeStatusProduct(productId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.PRODUCT.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_Product
 */
const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.product_id;
    // Check exists
    const serviceResDetail = await productService.detailProduct(productId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await productService.deleteProduct(productId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PRODUCT.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list options Product
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await productService.getOptions(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceResDetail);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListProduct,
  detailProduct,
  createProduct,
  updateProduct,
  changeStatusProduct,
  deleteProduct,
  getOptions,
};
