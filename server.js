var Hapi = require('hapi'),
  fs = require('fs'),
  routes;

var server = new Hapi.Server();

// Load configurations
var env = process.env.NODE_ENV || 'development',
  config = require('./config/config')[env],
  mongoose = require('mongoose');

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};

connect();

mongoose.connection.on('open', function () {
  console.log("mongoose connection is open");
});

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

server.connection({
  port: config.port
});

server.views({
  engines: {html: require('handlebars')},
  path: __dirname + '/app/views'
});

routes = require('./config/routes');

server.route(routes);

module.exports = server;
