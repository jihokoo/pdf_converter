var Lab = require("lab"),
  code = require("code"),
  mongoose = require("mongoose"),
  server = require("../server");

var lab = exports.lab = Lab.script();

var Thumbnail = mongoose.model("Thumbnail");

lab.experiment("GET /thumbs", function() {

  lab.before(function(done) {
    Thumbnail.collection.remove(done);
  });

  lab.test("should reply with Content-Type text/json",
    function(done) {
      var options = {
        method: "GET",
        url: "/thumbs"
      };

      server.inject(options, function(response) {
        var result = response.result;

        code.expect('Content-Type', /json/);
        code.expect(response.statusCode).to.equal(200);
        code.expect(result).to.be.instanceof(Array);
        code.expect(result).to.have.length(0);
        done();
      });
    });

  lab.test("should reply with a thumbnail if there is one in the DB", function(done) {
    var thumbnailOne = new Thumbnail({
      name: "LobLogo_thumb_1",
      url: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_1.png",
      originalFileURL: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Files/LobLogo.pdf"
    });

    thumbnailOne.save(function(err) {
      var options = {
        method: "GET",
        url: "/thumbs"
      };

      server.inject(options, function(response) {
        var result = response.result;

        code.expect('Content-Type', /json/);
        code.expect(response.statusCode).to.equal(200);
        code.expect(result).to.be.instanceof(Array);
        code.expect(result).to.have.length(1);

        code.expect(result[0].name).to.equal(thumbnailOne.name);
        code.expect(result[0].url).to.equal(thumbnailOne.url);
        done();
      });

    });
  });

  lab.test("should be able to reply with multiple thumbnails", function(done) {
    var thumbnailTwo = new Thumbnail({
      name: "LobLogo_thumb_2",
      url: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_2.png",
      originalFileURL: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Files/LobLogo.pdf"
    });

    thumbnailTwo.save(function(err) {
      var options = {
        method: "GET",
        url: "/thumbs"
      };

      server.inject(options, function(response) {
        var result = response.result;

        code.expect('Content-Type', /json/);
        code.expect(response.statusCode).to.equal(200);
        code.expect(result).to.be.instanceof(Array);
        code.expect(result).to.have.length(2);

        code.expect(result[0].name).to.equal("LobLogo_thumb_1");
        code.expect(result[1].name).to.equal(thumbnailTwo.name);
        code.expect(result[1].url).to.equal(thumbnailTwo.url);
        done();
      });

    });
  });
});

