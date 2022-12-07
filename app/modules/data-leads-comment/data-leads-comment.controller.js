const dataLeadsCommentService = require('./data-leads-comment.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const callSoapTest = async (req, res, next) => {
  try {
    const url = 'https://ws.campaigner.com/2013/01/campaignmanagement.asmx?wsdl';
    const requestArgs = {
      authentication: {
        Username: 'vytc@rubyfitness.vn',
        Password: 'Hungvy151@',
      },
      campaignFilter: {
        CampaignIds: [],
        CampaignRunIds: [],
        CampaignNames: [],
      },
      dateTimeFilter: {
        FromDate: {
          $attributes: {
            'xsi:nil': 'true',
          },
        },
        ToDate: {
          $attributes: {
            'xsi:nil': 'true',
          },
        },
      },
      campaignStatus: {
        $attributes: {
          'xsi:nil': 'true',
        },
      },
      campaignType: {
        $attributes: {
          'xsi:nil': 'true',
        },
      },
    };

    const wsdlOptions = {
      attributesKey: '$attributes',
      overrideRootElement: {
        namespace: '',
        xmlnsAttributes: [{
          name: 'xmlns',
          value: 'https://ws.campaigner.com/2013/01',
        }],
      },
    };
    const resultService = await callSoap(url, wsdlOptions, requestArgs,'ListCampaigns');
    return res.json(new SingleResponse(resultService, ''));

  } catch (error) {
    return next(error);
  }
};
const callSoap = async (url, wsdlOptions, requestArgs,functionName) => {
  return new Promise((resolve, reject) => {
    const soap = require('soap');
    soap.createClient(url, wsdlOptions, (err, client) => {
      if (err) {
        return resolve(null);
      }
      else {
        const method = client[functionName];
        method(requestArgs, (err, result, envelope, soapHeader) => {
          //response envelope string XML
          if (err) {
            return resolve(null);
          }
          console.log(envelope);
          //'result' is the response body
          console.log(result);
          return resolve(result);
        });
      }
    });
  });
};
/**
 * Get list 
 */
const getListDataleadsComment = async (req, res, next) => {
  try {
    const serviceRes = await dataLeadsCommentService.getListDataleadsComment(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createDataleadsComment = async (req, res, next) => {
  try {
    req.body.comment_id = null;
    const serviceRes = await dataLeadsCommentService.createDataleadsCommentOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DATALEADSCOMMENT.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  callSoapTest,
  getListDataleadsComment,
  createDataleadsComment,
};
