const test = require('tape');
const memoize = require('./memoize');

test('memoize works', function(t) {
  let source = 123;
  const fn = memoize((a, b) => source);
  t.equal(fn(2, 5), 123, 'returns correct data on first call');
  source = 404;
  t.equal(fn(2, 5), 123, 'has memoized data on the first call');
  t.equal(fn(8), 404, 'return correct data when arguments has changed');
  t.end();
});