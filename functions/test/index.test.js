var assert = require('assert').assert;
var first = require("../Index");



describe('Index', function () {
    it('Index should return Hello World! May the force be with you!', function() {
        assert.equals(Index(), 'Hello World! May the force be with you!');
    });
});

