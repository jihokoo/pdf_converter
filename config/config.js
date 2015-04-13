var path = require('path'),
  rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    db: 'mongodb://localhost/lob_dev',
    root: rootPath,
    port: 8000,
    app: {
      name: 'Lob Interview Project'
    },
  },
  test: {
    db: 'mongodb://localhost/lob_test',
    root: rootPath,
    port: 8000,
    app: {
      name: 'Lob Interview Project'
    }
  }
};
