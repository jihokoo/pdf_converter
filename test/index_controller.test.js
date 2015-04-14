var Lab = require("lab"),
  code = require("code"),
  server = require("../server");

var lab = exports.lab = Lab.script();

lab.experiment("Index Controller", function() {

  lab.experiment("GET /", function() {

    lab.test("should render home page", function(done) {
      var options = {
        method: "GET",
        url: "/"
      };
      server.inject(options, function(response) {

        code.expect('Content-Type', /html/);
        code.expect(response.statusCode).to.equal(200);

        done();
      });
    });
  });
});
