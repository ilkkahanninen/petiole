const test = require('tape');
const {
  replace,
} = require('./index');

test('replace: returns correct value', function(t) {
  const src = {};
  const trg = replace({
    foo: 321,
    tree: {
      bar: (state, action) => action.value,
    },
  })(src, { value: 'X' });

  t.deepEqual(trg, {
    foo: 321,
    tree: {
      bar: 'X',
    },
  });
  t.end();
});

test('replace: does not create new object if nothing has changed', function(t) {
  const state = {
    name: 'foo',
    settings: {
      enabled: true
    },
  };
  const reducer = replace({
    name: (state, action) => action.name,
    settings: {
      enabled: (state, action) => action.enabled,
    },
  });
  const action = {
    name: 'foo',
    enabled: true,
  };
  const newState = reducer(state, action);
  t.equal(state, newState);
  t.end();
});
