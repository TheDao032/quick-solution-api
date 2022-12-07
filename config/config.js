const Joi = require('joi');

// require('dotenv').config();
require('custom-env').env(process.env.NODE_ENV);

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'staging', 'production'])
    .default('development'),
  APP_URL: Joi.string().required(),
  RUN_LOCAL: Joi.string().optional().default('no'),
  UNIT_TESTING: Joi.string().optional().default('no'),
  HASH_SECRET_KEY: Joi.string().required(),
  DOMAIN_CDN: Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  appName: 'Ruby API',
  env: envVars.NODE_ENV,
  port: 3000,
  runLocal: envVars.RUN_LOCAL === 'yes',
  testing: envVars.UNIT_TESTING === 'yes',
  appWelcome: envVars.APP_WELCOME,
  appUrl: envVars.APP_URL,
  hashSecretKey: envVars.HASH_SECRET_KEY,
  token: {
    key: 'Authorization',
    type: 'Bearer',
  },
  domain_cdn: envVars.DOMAIN_CDN,
  database: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'mssql',
  },
  sql: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    port: 1433,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
  adminUserName: 'administrator',
  sendSms:{
    url: 'http://api.abenla.com/Service.asmx?wsdl',
    loginName:'AB11B6M',
    pass:'1TLU5XE6N',
  },
  sendEmail:{
    hostname: 'api.sendgrid.com',
    apiKey:'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',
  },
  sendGmail:{
    user: 'devrubyfitness@gmail.com',
    pass:'Des123456@',
  },
};

module.exports = config;
