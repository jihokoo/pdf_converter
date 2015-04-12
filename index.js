var Hapi = require('hapi');
var Joi  = require('joi');
var routes = require('./config/routes');

var server = new Hapi.Server('127.0.0.1', '8000');

server.route(routes);

if (!module.parent) {
  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });
}

module.exports = server;
