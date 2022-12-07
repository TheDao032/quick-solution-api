const express = require('express');
const validate = require('express-validation');
const newsController = require('./news.controller');
const routes = express.Router();
const rules = require('./news.rule');
const prefix = '/news';

// Get List Tag
routes.route('/get-tag')
  .get(newsController.getListTag);

// Get List MetaKeyword
routes.route('/get-meta-keyword')
  .get(newsController.getListMetaKeyword);

// Check tag
routes.route('/check-tag')
  .put(newsController.checkTag);

// Check meta keyword
routes.route('/check-meta-keyword')
  .put(newsController.checkMetaKeyword);

// Get List
routes.route('')
  .get(newsController.getListNews);

// Detail a area
routes.route('/:newsId(\\d+)')
  .get(newsController.detailNews);

// Create new a area
routes.route('')
  .post(validate(rules.createNews),newsController.createNews);

// Update a area
routes.route('/:newsId(\\d+)')
  .put(validate(rules.updateNews),newsController.updateNews);

// Change status
routes.route('/:newsId/change-status')
  .put(validate(rules.changeStatusNews), newsController.changeStatusNews);

// Delete a area
routes.route('/:newsId(\\d+)')
  .delete(newsController.deleteNews);

module.exports = {
  prefix,
  routes,
};
