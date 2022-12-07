const commentService = require('./comment.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_STORE
 */
const getListComment = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    req.query.product_id = productId;
    const serviceRes = await commentService.getListComment(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getListProduct = async (req, res, next) => {
  try {
    req.query.auth_id = req.body.auth_id;
    const serviceRes = await commentService.getListProduct(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail MD_STORE
 */
const detailComment = async (req, res, next) => {
  try {
    const serviceRes = await commentService.detailComment(req.params.commentId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const detailCommentReply = async (req, res, next) => {
  try {
    const serviceRes = await commentService.detailCommentReply(req.params.commentId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const detailProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const serviceRes = await commentService.detailProduct(productId);
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
const createCommentReply = async (req, res, next) => {
  try {
    const serviceRes = await commentService.createCommentReplyOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.COMMENT.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    req.body.product_comment_id = commentId;

    const serviceResDetail = await commentService.detailComment(commentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await commentService.createCommentOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.COMMENT.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const updateCommentReply = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    req.body.product_comment_id = commentId;

    const serviceResDetail = await commentService.detailCommentReply(commentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await commentService.createCommentReplyOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.COMMENT.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    const serviceResDetail = await commentService.detailComment(commentId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await commentService.deleteComment(commentId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.COMMENT.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListComment,
  detailComment,
  detailCommentReply,
  createCommentReply,
  updateComment,
  updateCommentReply,
  deleteComment,
  getListProduct,
  detailProduct,
};
