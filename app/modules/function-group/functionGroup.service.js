const database = require('../../models');
const FunctionGroupClass = require('./functionGroup.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getList = async (params = {}) => {
  try {
    const defaultParams = {
      keyword: null,
      is_active: API_CONST.ISACTIVE.ALL,
      is_system: API_CONST.ISSYSTEM.ALL,
      itemsPerPage: API_CONST.PAGINATION.LIMIT,
      page: API_CONST.PAGINATION.DEFAULT,
      created_date_from:'',
      created_date_to:'',
      created_user:'',
    };
    const parameters = Object.assign({}, defaultParams, params);
    //
    const dataList = await database.sequelize.query(`${PROCEDURE_NAME.SYS_FUNCTIONGROUP_GETLIST} 
    @KEYWORD = :keyword,
    @ISACTIVE = :is_active,
    @ISSYSTEM = :is_system,
    @PAGESIZE = :itemsPerPage,
    @PAGEINDEX = :page,
    @CREATEDDATEFROM = :created_date_from,
    @CREATEDDATETO = :created_date_to,
    @CREATEDUSER = :created_user`,
    {
      replacements: parameters,
      type: database.QueryTypes.SELECT,
    });
    //
    return {
      'list': FunctionGroupClass.list(dataList),
      'total': dataList[0]['TOTALITEMS'],
    };
  } catch (error) {
    console.error('functionGroupService.getList', error);
    return [];
  }
};

const create = async (params = {}) => {
  try {
    await createOrUpdateHandler(null, params);
    return true;
  } catch (error) {
    console.error('functionGroupService.create', error);
    return false;
  }
};

const update = async (id, params = {}) => {
  try {
    await createOrUpdateHandler(id, params);
    return true;
  } catch (error) {
    console.error('functionGroupService.update', error);
    return false;
  }
};

const createOrUpdateHandler = async (id = null, params = {}) => {
  const defaultParams = {
    function_group_id: id,
    function_group_name: null,
    description: null,
    order_index: null,
    is_active: API_CONST.ISACTIVE.ACTIVE,
    is_system: API_CONST.ISSYSTEM.NOT_SYSTEM,
    created_user: null,
    functions: [],
  };
  const parameters = Object.assign({}, defaultParams, params, {
    created_user: params.created_user || params.updated_user || null,
    functions: params.functions.join('|'),
  });

  const query = `${PROCEDURE_NAME.SYS_FUNCTIONGROUP_CREATEORUPDATE} 
  @FUNCTIONGROUPID = :function_group_id,
  @FUNCTIONGROUPNAME = :function_group_name,
  @DESCRIPTION = :description,
  @ORDERINDEX = :order_index,
  @ISACTIVE = :is_active,
  @ISSYSTEM = :is_system,
  @FUNCTIONID = :functions,
  @CREATEDUSER = :created_user`;

  removeCacheOptions();

  // Call procedure
  return await database.sequelize.query(query, {
    replacements: parameters,
    type: database.QueryTypes.INSERT,
  });
};

const detail = async (id) => {
  try {
    const functionGroup = await database.sequelize.query(`${PROCEDURE_NAME.SYS_FUNCTIONGROUP_GETBYID} @FUNCTIONGROUPID=:FUNCTIONGROUPID`, {
      replacements: {
        'FUNCTIONGROUPID': id,
      },
      type: database.QueryTypes.SELECT,
    });
    if (functionGroup.length) {
      return FunctionGroupClass.detail(functionGroup[0]);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const remove = async (id, params = {}) => {
  try {
    await database.sequelize.query(`${PROCEDURE_NAME.SYS_FUNCTIONGROUP_DELETE} @FUNCTIONGROUPID=:FUNCTIONGROUPID, @DELETEDUSER=:DELETEDUSER`, {
      replacements: {
        'FUNCTIONGROUPID': id,
        'DELETEDUSER': params.deleted_user || null,
      },
      type: database.QueryTypes.UPDATE,
    });

    removeCacheOptions();

    return true;
  } catch (error) {
    return true;
  }
};

const updateStatus = async (id, params = {}) => {
  try {
    await database.sequelize.query(`${PROCEDURE_NAME.SYS_FUNCTIONGROUP_UPDATESTATUS} @FUNCTIONGROUPID=:FUNCTIONGROUPID, @ISACTIVE = :ISACTIVE, @UPDATEDUSER=:UPDATEDUSER`, {
      replacements: {
        'FUNCTIONGROUPID': id,
        'ISACTIVE': params.is_active || API_CONST.ISACTIVE.INACTIVE,
        'UPDATEDUSER': params.updated_user || null,
      },
      type: database.QueryTypes.UPDATE,
    });

    removeCacheOptions();

    return true;
  } catch (error) {
    return true;
  }
};
const checkName = async (function_group_name, function_group_id = null) => {
  try {

    const query = `${PROCEDURE_NAME.SYS_FUNCTIONGROUP_CHECKNAME} 
      @FUNCTIONGROUPID=:FUNCTIONGROUPID,
      @FUNCTIONGROUPNAME=:FUNCTIONGROUPNAME`;
    const check = await database.sequelize.query(query, {
      replacements: {
        'FUNCTIONGROUPID': function_group_id,
        'FUNCTIONGROUPNAME': function_group_name,
      },
      type: database.QueryTypes.SELECT,
    });

    const isCheck = check[0] && check[0]['RESULT'];
    return isCheck ? true : false;
  } catch (error) {
    console.error('functionGroupService.checkName', error);
    return false;
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.SYS_FUNCTIONGROUP_OPTIONS);
};

module.exports = {
  getList,
  create,
  detail,
  update,
  remove,
  updateStatus,
  checkName,
};
