var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();
var blanket = require("blanket")({
  "pattern": "/source/"
});
chai.use(chaiHttp);

describe('Server', function () {
  describe('Start', function () {
    it('server should start and host upon port 8080', function () {
      var returns = server.start();
      expect(returns).to.not.be.null;
      expect(returns.Application).to.not.be.null;
      expect(returns.Server).to.not.be.null;
    });
  });
});
