#!/usr/bin/env node

/*
  I separated index.js into two files, this file and server.js
  to allow other files to require the server through server.js
  without starting it
*/
var server = require('./server');

server.start(function() {
  console.log('Server running at:', server.info.uri);
});
