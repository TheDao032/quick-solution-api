const newsClass = require('../news/news.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const folderName = 'news';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListTag = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()

      .execute(PROCEDURE_NAME.NEWS_NEWS_GETLISTTAG_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': newsClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'newsService.getListTag'});
    return new ServiceResponse(true, '', {});
  }
};

const getListMetaKeyword = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()

      .execute(PROCEDURE_NAME.NEWS_NEWS_GETLISTMETAKEYWORD_ADMINWEB);

    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': newsClass.listAll(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'newsService.getListMetaKeyword'});
    return new ServiceResponse(true, '', {});
  }
};

const checkTag = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('NEWSTAG', apiHelper.getValueFromObject(bodyParams, 'tag'))
      .execute(PROCEDURE_NAME.NEWS_NEWS_CHECKTAG_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWS.EXISTS_TAG, null);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'newsService.checkTag'});
    return new ServiceResponse(false);
  }
};

const checkMetaKeyword = async (bodyParams) => {
  try {
    const pool = await mssql.pool;

    const dataCheck = await pool.request()
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta-keyword'))
      .execute(PROCEDURE_NAME.NEWS_NEWS_CHECKMETAKEYWORD_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWS.EXISTS_METAKEYWORD, null);
    }
    else{
      return new ServiceResponse(true);
    }
  } catch (e) {
    logger.error(e, {'function': 'newsService.checkMetaKeyword'});
    return new ServiceResponse(false);
  }
};

const getListNews = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('NEWSSTATUSID', apiHelper.getValueFromObject(queryParams, 'news_status_id'))
      .input('NEWSCATEGORYID', apiHelper.getValueFromObject(queryParams, 'news_category_id'))
      .input('NEWSDATEFROM', apiHelper.getValueFromObject(queryParams, 'news_date_from'))
      .input('NEWSDATETO', apiHelper.getValueFromObject(queryParams, 'news_date_to'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.NEWS_NEWS_GETLIST_ADMINWEB);
    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': newsClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'newsService.getListNews'});
    return new ServiceResponse(true, '', {});
  }
};

const detailNews = async (newsId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('NEWSID', newsId)
      .execute(PROCEDURE_NAME.NEWS_NEWS_GETBYID_ADMINWEB);

    let news = data.recordset;
    // If exists news
    if (news && news.length>0) {
      news = newsClass.detail(news[0]);
      return new ServiceResponse(true, '', news);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'newsService.detailNews'});
    return new ServiceResponse(false, e.message);
  }
};
const createNewsOrUpdate = async (bodyParams) => {
  try {
    const params = bodyParams;
    if(params.image_url) {
      const image_url = await saveImage(params.image_url);
      if (image_url)
        params.image_url = image_url;
      else
        return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
    }
    const pool = await mssql.pool;

    //check name
    const dataCheck = await pool.request()
      .input('NEWSID', apiHelper.getValueFromObject(bodyParams, 'news_id'))
      .input('NEWSTITLE', apiHelper.getValueFromObject(bodyParams, 'news_title'))
      .execute(PROCEDURE_NAME.NEWS_NEWS_CHECKNAME_ADMINWEB);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(false, RESPONSE_MSG.NEWS.EXISTS_NAME, null);
    }

    const data = await pool.request()
      .input('NEWSID', apiHelper.getValueFromObject(bodyParams, 'news_id'))
      .input('NEWSTITLE', apiHelper.getValueFromObject(bodyParams, 'news_title'))
      .input('NEWSDATE', apiHelper.getValueFromObject(bodyParams, 'news_date'))
      .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('CONTENT', apiHelper.getValueFromObject(bodyParams, 'content'))
      .input('AUTHORFULLNAME', apiHelper.getValueFromObject(bodyParams, 'author_full_name'))
      .input('NEWSSOURCE', apiHelper.getValueFromObject(bodyParams, 'news_source'))
      .input('ISVIDEO', apiHelper.getValueFromObject(bodyParams, 'is_video'))
      .input('VIDEOLINK', apiHelper.getValueFromObject(bodyParams, 'video_link'))
      .input('NEWSSTATUSID', apiHelper.getValueFromObject(bodyParams, 'news_status_id'))
      .input('NEWSCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'news_category_id'))
      .input('NEWSTAG', apiHelper.getValueFromObject(bodyParams, 'news_tag'))
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_key_words'))
      .input('METADESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'meta_description'))
      .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
      .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
      .input('IMAGEFILEID', 1)
      .input('IMAGEURL', params.image_url)
      .input('SMALLTHUMBNAILIMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'small_thumbnail_image_file_id'))
      .input('SMALLTHUMBNAILIMAGEURL', apiHelper.getValueFromObject(bodyParams, 'small_thumbnail_image_url'))
      .input('MEDIUMTHUMBNAILIMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'medium_thumbnail_image_file_id'))
      .input('MEDIUMTHUMBNAILIMAGEURL', apiHelper.getValueFromObject(bodyParams, 'medium_thumbnail_image_url'))
      .input('LARGETHUMBNAILIMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'large_thumbnail_image_file_id'))
      .input('LARGETHUMBNAILIMAGEURL', apiHelper.getValueFromObject(bodyParams, 'large_thumbnail_image_url'))
      .input('XLARGETHUMBNAILIMAGEFILEID', apiHelper.getValueFromObject(bodyParams, 'xlarge_thumbnail_image_file_id'))
      .input('XLARGETHUMBNAILIMAGEURL', apiHelper.getValueFromObject(bodyParams, 'xlarge_thumbnail_image_url'))
      .input('VIEWCOUNT', apiHelper.getValueFromObject(bodyParams, 'view_count'))
      .input('COMMENTCOUNT', apiHelper.getValueFromObject(bodyParams, 'comment_count'))
      .input('LIKECOUNT', apiHelper.getValueFromObject(bodyParams, 'like_count'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
      .input('ISSHOWHOME', apiHelper.getValueFromObject(bodyParams, 'is_show_home'))
      .input('ISHIGHLIGHT', apiHelper.getValueFromObject(bodyParams, 'is_high_light'))
      .input('ISSHOWNOTIFY', apiHelper.getValueFromObject(bodyParams, 'is_show_notify'))
      .input('ISHOTNEWS', apiHelper.getValueFromObject(bodyParams, 'is_hot_news'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWS_CREATEORUPDATE_ADMINWEB);
    const newsId= data.recordset[0].RESULT;
    return new ServiceResponse(true,'',newsId);
  } catch (e) {
    logger.error(e, {'function': 'newsService.createNewsOrUpdate'});
    return new ServiceResponse(false);
  }
};

const changeStatusNews = async (newsId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('NEWSID', newsId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWS_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {'function': 'newsService.changeStatusNews'});
    return new ServiceResponse(false);
  }
};

const deleteNews = async (newsId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('NEWSID',newsId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.NEWS_NEWS_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.NEWS.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'newsService.deleteNews'});
    return new ServiceResponse(false, e.message);
  }
};

const saveImage = async (base64) => {
  let url = null;
  try {
    if (fileHelper.isBase64(base64)) {
      const extentions = ['.jpeg', '.jpg', '.png', '.gif'];
      const extention = fileHelper.getExtensionFromBase64(base64, extentions);
      if (extention) {
        const guid = createGuid();
        url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extention}`);
      }
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      'function': 'newsService.saveImage',
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
module.exports = {
  getListNews,
  detailNews,
  createNewsOrUpdate,
  deleteNews,
  changeStatusNews,
  getListTag,
  getListMetaKeyword,
  checkTag,
  checkMetaKeyword,
};
