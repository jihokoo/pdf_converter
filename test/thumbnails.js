var Lab = require("lab"),
  code = require("code"),
  server = require("../server");

var lab = exports.lab = Lab.script();

lab.experiment("GET /thumbs", function() {
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

  lab.test("should reply with a thumbnail if there is one in the DB",
    function(done) {
      var options = {
        method: "GET",
        url: "/thumbs"
      };

      done();
    });
});

