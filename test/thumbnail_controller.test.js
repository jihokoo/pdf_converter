var Lab = require("lab"),
  code = require("code"),
  mongoose = require("mongoose"),
  fs = require("fs"),
  server = require("../server");

var exec = require("child_process").exec;
var lab = exports.lab = Lab.script();

var Thumbnail = mongoose.model("Thumbnail");

lab.experiment("Thumbnails Controller", function() {

  lab.before(function(done) {
    // make sure to have empty db before test
    Thumbnail.collection.remove(done);
  });

  lab.after(function(done) {
    // make sure to delete thumbnails
    exec("rm -rf ./public/thumbnails/*", function(){
      done();
    });
  });

  lab.experiment("GET /thumbs", function() {

    lab.test("should reply with Content-Type text/json", function(done) {
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
        url: "http://localhost:8000/thumbs/LobLogo_thumb_1.png",
        imageUrl: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_1.png"
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
        url: "http://localhost:8000/thumbs/LobLogo_thumb_2.png",
        imageUrl: "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/LobLogo_thumb_2.png"
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

  lab.experiment("POST /thumbs", function() {

    lab.test("should be able to create new Thumbnails", function(done) {

      var file = fs.readFileSync('./test.pdf'); // read in test pdf file
      var boundary = Math.random();

      var headers = {
          'Content-Type': 'multipart/form-data; boundary='+ boundary
      };

      // set payload for multipart/form-data with correct fields
      var payload = '--'+ boundary +'\r\n' +
        'Content-Disposition: form-data; name="file"; filename="test.pdf"\r\n' +
        'Content-Type: application/pdf\r\n' +
        '\r\n' +
        file + '\r\n' +
        '--'+ boundary +'--';

      var options = {
        method: "POST",
        url: "/thumbs",
        headers: headers,
        payload: payload
      };

      server.inject(options, function(response) {
        var result = response.result;

        code.expect('Content-Type', /json/);
        code.expect(response.statusCode).to.equal(200);
        code.expect(result).to.be.instanceof(Array);
        code.expect(result.length).to.be.above(0);

        var thumbnailOne = result[0];
        var thumbnailTwo = result[1];

        code.expect(thumbnailOne.name).to.equal("test_thumb_0.png");
        code.expect(thumbnailOne.url).to.equal("http://localhost:8000/thumbs/test_thumb_0.png");
        code.expect(thumbnailTwo.name).to.equal("test_thumb_1.png");
        code.expect(thumbnailTwo.url).to.equal("http://localhost:8000/thumbs/test_thumb_1.png");
        done();
      });
    });

  });

});

