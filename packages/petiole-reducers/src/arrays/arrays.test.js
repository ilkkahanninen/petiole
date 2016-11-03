const test = require('tape');
const merge = require('../objects/merge');
const pluck = require('../type-agnostic/pluck');
const push = require('./push');
const remove = require('./remove');

test('push: adds item correctly', function(t) {
  const state = {
    list: ['foo', 'bar'],
    as: [],
  };
  const reducer = merge({
    list: push(pluck('name')),
    as: push('a'),
  });
  const newState = reducer(
    state,
    { name: 'zoo' }
  );
  t.deepEqual(
    newState,
    {
      list: ['foo', 'bar', 'zoo'],
      as: ['a'],
    }
  );
  t.end();
});

test('remove: removed items from array', function(t) {
  const state = {
    list: [
      {
        id: 10,
        name: 'John',
      },
      {
        id: 23,
        name: 'Mary',
      },
      {
        id: 32,
        name: 'Bob',
      },
      {
        id: 44,
        name: 'James',
      },
    ],
  };
  const reducer = merge({
    list: remove({ id: pluck('id') }),
  });
  const newState = reducer(
    state,
    { id: 32 }
  );
  t.deepEqual(
    newState,
    {
      list: [
        {
          id: 10,
          name: 'John',
        },
        {
          id: 23,
          name: 'Mary',
        },
        {
          id: 44,
          name: 'James',
        },
      ],
    }
  );
  t.end();
});
