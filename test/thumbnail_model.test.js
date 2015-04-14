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

  lab.test('should have name, url, and imageUrl fields of String', function(done) {
    var validThumbnail = new Thumbnail({
      name: "LobLogo_thumb_1.png",
      url: "http://localhost:8000/thumbs/LobLogo_thumb_1.png",
      imageUrl: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_1.png"
    });

    validThumbnail.save(function(err, thumbnail) {
      code.expect(thumbnail.name).to.equal("LobLogo_thumb_1.png");
      code.expect(thumbnail.url).to.equal("http://localhost:8000/thumbs/LobLogo_thumb_1.png");
      done();
    });
  });

  lab.test('should hide imageUrl field on select', function(done) {
    Thumbnail.findOne({name: "LobLogo_thumb_1.png"}, function(err, thumbnail) {
      code.expect(thumbnail.name).to.equal("LobLogo_thumb_1.png");
      code.expect(thumbnail.imageUrl).to.equal(undefined);
      done();
    });
  });

  lab.test("should require name", function(done) {
    var invalidThumbnail = new Thumbnail({
      url: "http://localhost:8000/thumbs/LobLogo_thumb_2.png",
      imageUrl: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_2.png"
    });

    invalidThumbnail.save(function(err) {
      code.expect(err.message).to.equal("Thumbnail validation failed");

      done();
    });
  });

  lab.test("should require url", function(done) {
    var invalidThumbnail = new Thumbnail({
      name: "LobLogo_thumb_2.png",
      imageUrl: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_2.png"
    });

    invalidThumbnail.save(function(err) {
      code.expect(err.message).to.equal("Thumbnail validation failed");

      done();
    });
  });

  lab.test("should require imageUrl", function(done) {
    var invalidThumbnail = new Thumbnail({
      url: "http://localhost:8000/thumbs/LobLogo_thumb_2.png",
      imageUrl: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_2.png"
    });

    invalidThumbnail.save(function(err) {
      code.expect(err.message).to.equal("Thumbnail validation failed");

      done();
    });
  });

  lab.test("should have an instance method to get itself as JSON", function(done) {
    Thumbnail.findOne({name: "LobLogo_thumb_1.png"}, function(err, thumbnail) {
      var jsonThumbnail = thumbnail.asJSON();
      code.expect(jsonThumbnail).to.match(/"name":"LobLogo_thumb_1.png"/);

      done();
    });
  });
});
