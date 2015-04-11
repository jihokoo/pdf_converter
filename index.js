var Hapi = require('hapi');
var Joi  = require('joi');

var server = new Hapi.Server('127.0.0.1', '8000');

server.start(function() {
  console.log('Server running at:', server.info.uri);
});
