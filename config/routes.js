var ThumbnailHandler = require("../app/handlers/thumbnail.js");

var routes = {
  path: "/thumbs",
  method: "GET",
  handler: ThumbnailHandler.getAll
};

module.exports = routes;
