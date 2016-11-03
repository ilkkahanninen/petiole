const test = require('tape');
const merge = require('./merge');
const pluck = require('../type-agnostic/pluck');

test('merge: merges correctly', function(t) {
  const src = {
    foo: 123,
    tree: {
      bar: 303,
      name: 'Ile',
    },
  };
  const trg = merge({
    foo: 321,
    tree: {
      bar: pluck('value'),
      siesta: {
        onGoing: true,
        deep: {
          yes: 'yes',
        }
      }
    },
  })(src, { value: 'X' });

  t.deepEqual(trg,
    {
      foo: 321,
      tree: {
        bar: 'X',
        name: 'Ile',
        siesta: {
          onGoing: true,
          deep: {
            yes: 'yes',
          }
        }
      },
    }
  );

  t.end();
});

test('merge: does not create new object if nothing has changed', function(t) {
  const state = {
    name: 'foo',
    settings: {
      enabled: true
    },
  };
  const reducer = merge({
    name: pluck('name'),
    settings: {
      enabled: pluck('enabled'),
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