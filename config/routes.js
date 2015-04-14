var ThumbnailHandler = require("../app/handlers/thumbnail.js");
var Joi  = require('joi');

var routes = [
  {
    path: "/thumbs",
    method: "GET",
    handler: ThumbnailHandler.getAll
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
              filename: Joi.string().min(1).regex(/^.*\.(pdf)$/).required()
              // http://stackoverflow.com/questions/21823379/how-to-upload-files-using-nodejs-and-hapi
            }).unknown()
          }).unknown()
        }
      }
    }
  }
];

module.exports = routes;
