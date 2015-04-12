var Hapi = require('hapi');
var Joi  = require('joi');
var routes = require('./config/routes');

var server = new Hapi.Server();

server.connection({
  port: 8000
});

server.route(routes);

module.exports = server;
