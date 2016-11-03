const test = require('tape');
const updatesObject = require('./updatesObject');

test('updatesObject: detectes positive', function(t) {
  t.ok(updatesObject(
    { id: 'foo' },
    { id: 'bar' }
  ));
  t.end();
});

test('updatesObject: detectes negative', function(t) {
  t.ok(!updatesObject(
    { id: 'foo' },
    { id: 'foo' }
  ));
  t.end();
});