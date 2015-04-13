var mongoose = require("mongoose"),
  Thumbnail = mongoose.model("Thumbnail");

function getAll (request, reply) {
  Thumbnail.find(function(err, thumbnails) {
    if (err) {
      reply(500, err);
    } else {
      reply(thumbnails);
    }
  });
}

module.exports = {
  getAll: getAll
};
