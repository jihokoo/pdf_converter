var Lab = require("lab"),
  code = require("code"),
  mongoose = require("mongoose"),
  server = require("../server");

var lab = exports.lab = Lab.script();

var Thumbnail = mongoose.model("Thumbnail");

lab.experiment('Thumbnail', function() {
  lab.before(function(done) {
    Thumbnail.collection.remove(done);
  });

  lab.test('should have name, url, and originalFileURL fields of String', function(done) {
    var validThumbnail = new Thumbnail({
      name: "LobLogo_thumb_1",
      url: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_1.png",
      originalFileURL: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Files/LobLogo.pdf"
    });

    validThumbnail.save(function(err, thumbnail) {
      code.expect(thumbnail.name).to.equal("LobLogo_thumb_1");
      code.expect(thumbnail.url).to.equal("https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_1.png");
      code.expect(thumbnail.originalFileURL).to.equal("https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Files/LobLogo.pdf");

      done();
    });
  });

  lab.test("should require name", function(done) {
    var invalidThumbnail = new Thumbnail({
      url: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_1.png",
      originalFileURL: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Files/LobLogo.pdf"
    });

    invalidThumbnail.save(function(err) {
      code.expect(err.message).to.equal("Thumbnail validation failed");

      done();
    });
  });

  lab.test("should require url", function(done) {
    var invalidThumbnail = new Thumbnail({
      name: "LobLogo_thumb_1",
      originalFileURL: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Files/LobLogo.pdf"
    });

    invalidThumbnail.save(function(err) {
      code.expect(err.message).to.equal("Thumbnail validation failed");

      done();
    });
  });

  lab.test("should require originalFileURL", function(done) {
    var invalidThumbnail = new Thumbnail({
      name: "LobLogo_thumb_1",
      url: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_1.png"
    });

    invalidThumbnail.save(function(err) {
      code.expect(err.message).to.equal("Thumbnail validation failed");

      done();
    });
  });

  lab.test("should have an instance method to get itself as JSON", function(done) {
    Thumbnail.findOne({name: "LobLogo_thumb_1"}, function(err, thumbnail) {
      var jsonThumbnail = thumbnail.asJSON();
      code.expect(jsonThumbnail).to.match(/"name":"LobLogo_thumb_1"/);
    });
  });
});
