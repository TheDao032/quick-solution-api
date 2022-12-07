const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const routes = express.Router();

const prefix = '/swagger';

// Swagger definition
const swaggerDefinition = {
  info: {
    description: 'This is a API for project RUBY.',
    version: '1.0.0',
    title: 'Swagger RUBY',
    contact: {
      email: 'rubyteam@yopmail.com',
    },
  },
  host: 'localhost:3000',
  basePath: '/api',
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./app/modules/swagger/portal/**/*.yaml'],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

routes.use('/portal', swaggerUi.serve);
// List options ward
routes.route('/portal')
  .get(swaggerUi.setup(swaggerSpec));

module.exports = {
  prefix,
  routes,
};
