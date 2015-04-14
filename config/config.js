var path = require('path'),
  rootPath = path.normalize(__dirname + '/..');

// separate db for dev and test
module.exports = {
  development: {
    db: 'mongodb://localhost/jhk_pdf_dev',
    root: rootPath,
    port: 8000,
    app: {
      name: 'PDF to Thumbnail Converter'
    },
  },
  test: {
    db: 'mongodb://localhost/jhk_pdf_test',
    root: rootPath,
    port: 8000,
    app: {
      name: 'PDF to Thumbnail Converter'
    }
  }
};
