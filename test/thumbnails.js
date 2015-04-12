var Lab = require("lab"),
  code = require("code"),
  server = require("../");

var lab = exports.lab = Lab.script();

lab.experiment("Thumbnails", function() {
  lab.test("Main endpoint lists our thumbnails",
    function(done) {
      var options = {
        method: "GET",
        url: "/thumbs"
      };

      server.inject(options, function(response) {
        var result = response.result;

        code.expect(response.statusCode).to.equal(200);
        code.expect(result).to.be.instanceof(Array);

        done();
      });
    });
});
