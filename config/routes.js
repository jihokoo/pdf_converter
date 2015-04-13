var mongoose = require("mongoose"),
  Thumbnail = mongoose.model("Thumbnail");

var routes = {
  path: "/thumbs",
  method: "GET",
  handler: function(requst, reply) {
    Thumbnail.find(function(err, thumbnails) {
      if (err) {
        reply(500, err);
      } else {
        reply(thumbnails);
      }
    });
  }
};

module.exports = routes;
