const express = require('express');
const validate = require('express-validation');
const segmentController = require('./segment.controller');
const routes = express.Router();
const rules = require('./segment.rule');
const prefix = '/segment';


// List userGroup
routes.route('')
  .get(segmentController.getListSegment);

// Detail a company
routes.route('/:segmentId(\\d+)')
  .get(segmentController.detailSegment);

// Create new a userGroup
routes.route('')
  .post(validate(rules.createSegment),segmentController.createSegment);

// Update a userGroup
routes.route('/:segmentId(\\d+)')
  .put(validate(rules.updateSegment),segmentController.updateSegment);

// Change status a company
routes.route('/:segmentId/change-status')
  .put(validate(rules.changeStatusSegment), segmentController.changeStatusSegment);

// Delete a company
routes.route('/:segmentId(\\d+)')
  .delete(segmentController.deleteSegment);

// List options am-company
routes.route('/get-options')
  .get(segmentController.getOptions);

module.exports = {
  prefix,
  routes,
};
