var assert = require('assert');
var hello = require('../src/swagger-min');

describe('fake test', function() {
    it('is a fake test', function() {
        assert.equal(1, 1);
    });
  it('says hello', function() {
    assert.equal('hello', hello());
  });
});
