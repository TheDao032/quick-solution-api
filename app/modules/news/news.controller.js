const newsService = require('./news.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_STORE
 */
const getListTag = async (req, res, next) => {
  try {
    const serviceRes = await newsService.getListTag(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const getListMetaKeyword = async (req, res, next) => {
  try {
    const serviceRes = await newsService.getListMetaKeyword(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const getListNews = async (req, res, next) => {
  try {
    const serviceRes = await newsService.getListNews(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const checkTag = async (req, res, next) => {
  try {
    const serviceRes = await newsService.checkTag(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null));
  } catch (error) {
    return next(error);
  }
};

const checkMetaKeyword = async (req, res, next) => {
  try {
    const serviceRes = await newsService.checkMetaKeyword(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail 
 */
const detailNews = async (req, res, next) => {
  try {
    const serviceRes = await newsService.detailNews(req.params.newsId);
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
const createNews = async (req, res, next) => {
  try {
    req.body.news_id = null;
    const serviceRes = await newsService.createNewsOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateNews = async (req, res, next) => {
  try {
    const newsId = req.params.newsId;
    req.body.news_id = newsId;

    const serviceResDetail = await newsService.detailNews(newsId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await newsService.createNewsOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status
 */
const changeStatusNews = async (req, res, next) => {
  try {
    const newsId = req.params.newsId;

    const serviceResDetail = await newsService.detailNews(newsId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await newsService.changeStatusNews(newsId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.NEWS.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteNews = async (req, res, next) => {
  try {
    const newsId = req.params.newsId;

    const serviceResDetail = await newsService.detailNews(newsId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await newsService.deleteNews(newsId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.NEWS.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListNews,
  detailNews,
  createNews,
  updateNews,
  deleteNews,
  changeStatusNews,
  getListTag,
  getListMetaKeyword,
  checkTag,
  checkMetaKeyword,
};
