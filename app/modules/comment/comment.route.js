const express = require('express');
const validate = require('express-validation');
const commentController = require('./comment.controller');
const routes = express.Router();
const rules = require('./comment.rule');
const prefix = '/comment';

// Get List
routes.route('/:productId(\\d+)')
  .get(commentController.getListComment);

routes.route('/product')
  .get(commentController.getListProduct);

// Detail a area
routes.route('/:commentId/detailComment')
  .get(commentController.detailComment);

routes.route('/:commentId/detailCommentReply')
  .get(commentController.detailCommentReply);

routes.route('/:productId/detailProduct')
  .get(commentController.detailProduct);

// Create new a area
routes.route('')
  .post(validate(rules.createCommentReply),commentController.createCommentReply);

// Update a area
routes.route('/:commentId/detailComment')
  .put(commentController.updateComment);

routes.route('/:commentId/detailCommentReply')
  .put(commentController.updateCommentReply);

// Delete a area
routes.route('/:commentId(\\d+)')
  .delete(commentController.deleteComment);

module.exports = {
  prefix,
  routes,
};
