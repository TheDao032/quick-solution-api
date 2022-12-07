/* eslint-disable consistent-return */
const dataLeadsMailService = require('./data-leads-mail.service');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ListResponse = require('../../common/responses/list.response');
const dataLeadsMailClass = require('../data-leads-mail/data-leads-mail.class');
const config = require('../../../config/config');
const _ = require('lodash');
const callHTTPS = async (options, data) => {
  return new Promise(((resolve, reject) => {
    try {
      const http = require('https');
      var req = http.request(options, (res) => {
        var chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          var body = Buffer.concat(chunks);
          resolve(JSON.parse(body.toString()));
        });
      });

      req.write(JSON.stringify(data));
      req.end();
    } catch (error) {
      reject(error);
    }
  }));
};
const getOptionCampaign = async (req, res, next) => {
  try {
    const options = {
      'method': 'GET',
      'hostname': config.sendEmail.hostname,
      'port': null,
      'path': '/v3/marketing/singlesends',
      'headers': {
        'authorization': 'Bearer ' + config.sendEmail.apiKey,
      },
    };
    const response = await callHTTPS(options, {});
    const dataFilter = _.filter(response.result, (item) => {
      let isFilter = false;
      if (item.status === 'scheduled' || item.status === 'draft') {
        isFilter = true;
      }
      if (isFilter) {
        return item;
      }
      return null;
    });
    return res.json(new SingleResponse(dataFilter));
  } catch (error) {
    return next(error);
  }
};
const getOptionFromEmail = async (req, res, next) => {
  try {
    const data = [
      { id: 1, name: 'From Email 1' },
      { id: 2, name: 'From Email 2' },
    ];
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};
const getDetailCampaign = async (req, res, next) => {
  try {
    const campaign_id = req.params.campaign_id;
    const options = {
      'method': 'GET',
      'hostname': config.sendEmail.hostname,
      'port': null,
      'path': '/v3/marketing/singlesends/' + campaign_id,
      'headers': {
        'authorization': 'Bearer ' + config.sendEmail.apiKey,
      },
    };
    const response = await callHTTPS(options, {});
    if (!response)
      return res.json(new SingleResponse(null));
    let campaign = {
      id: response.id,
      name: response.name,
      sender_id: response.sender_id,
      sender_name: '',
      sender_email: '',
      status: response.status,
      list:[],
    };
    const optionsSender = {
      'method': 'GET',
      'hostname': config.sendEmail.hostname,
      'port': null,
      'path': '/v3/marketing/senders/' + campaign.sender_id,
      'headers': {
        'authorization': 'Bearer ' + config.sendEmail.apiKey,
      },
    };
    const responseSender = await callHTTPS(optionsSender, {});

    if (responseSender && responseSender.from) {
      campaign.sender_name = responseSender.from.name;
      campaign.sender_email = responseSender.from.email;
    }
    if (response.filter && response.filter.list_ids.length > 0) {
      const list_ids = response.filter.list_ids;
      let list=[];
      await Promise.all(list_ids.map(async (item) => {
        let itemTemp = await item;
        const optionsList = {
          'method': 'GET',
          'hostname': config.sendEmail.hostname,
          'port': null,
          'path': '/v3/marketing/lists/' + item,
          'headers': {
            'authorization': 'Bearer ' + config.sendEmail.apiKey,
          },
        };
        const responseList = await callHTTPS(optionsList, {});
        if (responseList) {
          list.push({
            id: responseList.id,
            name: responseList.name,
          });
        }
        item = itemTemp;
      }));
      campaign.list = list;
    }
    return res.json(new SingleResponse(campaign));
  } catch (error) {
    return next(error);
  }
};
/**
 * Create new a MD_AREA
 */
const createDataLeadsMail = async (req, res, next) => {
  try {
    let contacts =[];
    await Promise.all(req.body.task_data_leads.map(async (item) => {
      let itemTemp = await item;
      const serviceResDetail = await dataLeadsMailService.detailCustomerDataLead(itemTemp.data_leads_id);
      if (serviceResDetail.isFailed()) {
        return next(serviceResDetail);
      }
      const customerDataLead = serviceResDetail.getData();
      const names= customerDataLead.full_name.split(' ');
      let first_name='';
      const last_name=names[0];
      for(let i =1;i<names.length;i++) {
        first_name += (first_name?' ':'') + names[i];
      }
      contacts.push({
        email: customerDataLead.email,
        first_name: first_name,
        last_name: last_name,
        address_line_1: customerDataLead.address_full.length > 100? customerDataLead.address:customerDataLead.address_full,
        country: customerDataLead.country_name,
      });
      item = itemTemp;
    }));
    const options = {
      'method': 'PUT',
      'hostname': config.sendEmail.hostname,
      'port': null,
      'path': '/v3/marketing/contacts',
      'headers': {
        'authorization': 'Bearer ' + config.sendEmail.apiKey,
      },
    };
    const response = await callHTTPS(options, {
      list_ids: [req.body.list_id],
      contacts: contacts,
    });
    if (!response) {
      return next(new ServiceResponse(false, RESPONSE_MSG.DATALEADSMAIL.CREATE_FAILED));
    }
    const serviceRes = await dataLeadsMailService.createDataLeadsMailOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse('', RESPONSE_MSG.DATALEADSMAIL.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  //getListDataleadsMail,
  createDataLeadsMail,
  getOptionCampaign,
  getOptionFromEmail,
  getDetailCampaign,
};
