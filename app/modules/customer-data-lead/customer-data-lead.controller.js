const customerDataLeadService = require('./customer-data-lead.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
/**
 * Get list CRM_CUSTOMERDATALEADS
 */
const getListCustomerDataLead = async (req, res, next) => {
  try {
    const serviceRes = await customerDataLeadService.getListCustomerDataLead(req.query);
    const { data, total, page, limit } = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a CRM_CUSTOMERDATALEADS
 */
const createCustomerDataLead = async (req, res, next) => {
  try {
    req.body.customerDataLeadId = null;
    // Check function alias exists
    if (req.body.phone_number) {
      const phoneExist = await customerDataLeadService.checkExistPhone(req.body.phone_number);
      if (phoneExist.getData()) {
        return next(new ErrorResponse(null, null, RESPONSE_MSG.CRM_CUSTOMERDATALEADS.CHECK_PHONE_FAILED));
      }
    }

    const serviceRes = await customerDataLeadService.createCustomerDataLead(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGN.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a customer-data-lead
 */
const updateCustomerDataLead = async (req, res, next) => {
  try {
    const bodyParams = req.body;
    const customerDataLeadId = req.params.customerDataLeadId;
    bodyParams.customer_data_lead_id = customerDataLeadId;

    // Check customer-data-lead exists
    const serviceResDetail = await customerDataLeadService.detailCustomerDataLead(customerDataLeadId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Check function alias exists
    const phoneExist = await customerDataLeadService.checkExistPhone(req.body.phone_number, customerDataLeadId);
    if (phoneExist.getData()) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.CRM_CUSTOMERDATALEADS.CHECK_PHONE_FAILED));
    }
    // Update customer-data-lead
    const serviceRes = await customerDataLeadService.updateCustomerDataLead(bodyParams);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGN.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_CUSTOMERDATALEADS
 */
const deleteCustomerDataLead = async (req, res, next) => {
  try {
    const customerDataLeadId = req.params.customerDataLeadId;

    // Check customer-data-lead exists
    const serviceResDetail = await customerDataLeadService.detailCustomerDataLead(customerDataLeadId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete customer-data-lead
    const dataDelete = {
      'customer_data_lead_id': customerDataLeadId,
      'updated_user': req.auth.user_name,
    };
    const serviceRes = await customerDataLeadService.deleteCustomerDataLead(dataDelete);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CAMPAIGN.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_CUSTOMERDATALEADS
 */
const detailCustomerDataLead = async (req, res, next) => {
  try {
    const serviceRes = await customerDataLeadService.detailCustomerDataLead(req.params.customerDataLeadId);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status CRM_CUSTOMERDATALEADS
 */
const changeStatusCustomerDataLead = async (req, res, next) => {
  try {
    const customerDataLeadId = req.params.customerDataLeadId;

    // Check customer-data-lead exists
    const serviceResDetail = await customerDataLeadService.detailCustomerDataLead(customerDataLeadId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    const dataUpdate = {
      'customer_data_lead_id': customerDataLeadId,
      'is_active': req.body.is_active,
      'user_name': req.auth.user_name,
    };
    const serviceResUpdate = await customerDataLeadService.changeStatusCustomerDataLead(dataUpdate);
    if (serviceResUpdate.isFailed()) {
      return next(serviceResUpdate);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CAMPAIGN.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await customerDataLeadService.getOptions(req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * approved CRM_CUSTOMERDATALEADS
 */
const approvedCustomerDataLeadReviewList = async (req, res, next) => {
  try {
    const serviceRes = await customerDataLeadService.approvedCustomerDataLeadReviewList(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};


/**
 * isapproved CRM_CUSTOMERDATALEADS
 */
const isApproved = async (req, res, next) => {
  try {
    const customerDataLeadId = req.params.customerDataLeadId;
    // Check customer-data-lead exists
    const serviceResDetail = await customerDataLeadService.detailCustomerDataLead(customerDataLeadId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const isApprovedServiceRes = await customerDataLeadService.isApproved(customerDataLeadId);
    if (isApprovedServiceRes.isFailed()) {
      return next(isApprovedServiceRes);
    }
    return res.json(new SingleResponse({ 'is_approved': isApprovedServiceRes.getData() }));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListCustomerDataLead,
  createCustomerDataLead,
  updateCustomerDataLead,
  deleteCustomerDataLead,
  detailCustomerDataLead,
  changeStatusCustomerDataLead,
};
