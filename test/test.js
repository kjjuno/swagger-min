var assert = require('assert');
var swagger = require('../src/swagger-min');

describe('swagger-min', function() {
  describe('minify', function() {
    it('is null when route does not exist', function() {
      var obj = swagger.minify('swagger.json', 'none', '/not-there');
      assert.equal(null, obj);
    });

    it('is not null when route does exist', function() {
      var obj = swagger.minify('swagger.json', 'post', '/pet');
      assert.notEqual(null, obj);
    });

    it('Finds min spec for POST /pet', function() {
      var obj = swagger.minify('swagger.json', 'post', '/pet');
      assert.notEqual(null, obj.paths['/pet'].post, 'POST /pet not found');
      assert.equal(1, Object.keys(obj.paths).length, 'Should only have 1 route');
      assert.equal(1, Object.keys(obj.paths['/pet']).length, 'Should only have 1 verb');

      assert.notEqual(null, obj.definitions.Pet, 'Did not find #/definitions/Pet');
      assert.notEqual(null, obj.definitions.Category, 'Did not find #/definitions/Category');
      assert.notEqual(null, obj.definitions.Tag, 'Did not find #/definitions/Tag');
      assert.equal(3, Object.keys(obj.definitions).length, 'Should only have 3 definitions');
    });
  });
});
