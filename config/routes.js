var IndexHandler = require("../app/handlers/index.js");
var ThumbnailHandler = require("../app/handlers/thumbnail.js");
var Joi  = require('joi');

var routes = [
  {
    path: "/",
    method: "GET",
    handler: IndexHandler.render
  },
  {
    path: "/thumbs",
    method: "GET",
    handler: ThumbnailHandler.getAll
  },
  {
    path: "/thumbs/{fileName}",
    method: "GET",
    handler: ThumbnailHandler.viewThumbnail,
    config: {
      validate: {
        params: {
          fileName: Joi.string().min(1).regex(/^.*\.(png)$/) // validate file name has png extension
        }
      }
    }
  },
  {
    path: "/thumbs",
    method: "POST",
    handler: ThumbnailHandler.create,
    config: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      },
      validate: {
        payload: {
          file: Joi.object({
            hapi: Joi.object({
              filename: Joi.string().min(1).regex(/^.*\.(pdf)$/).required() // validate file name has pdf extension
            }).unknown()
          }).unknown()
        }
      }
    }
  }
];

module.exports = routes;
