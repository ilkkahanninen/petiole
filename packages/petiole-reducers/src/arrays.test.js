const test = require('tape');
const {
  merge,
  pluck,
  push,
  pushMany,
  remove,
  removeAtIndex
} = require('./index');

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

test('pushMany: adds items correctly', function(t) {
  const state = {
    list: ['foo', 'bar'],
    as: [],
  };
  const reducer = merge({
    list: pushMany(pluck('names')),
    as: pushMany(['a', 'b']),
  });
  const newState = reducer(
    state,
    { names: ['zoo', 'zork'] }
  );
  t.deepEqual(
    newState,
    {
      list: ['foo', 'bar', 'zoo', 'zork'],
      as: ['a', 'b'],
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

test('removeAtIndex: removed items from array', function(t) {
  const state = {
    list: ['zero', 'one', 'two', 'three'],
  };
  const reducer = merge({
    list: removeAtIndex(2),
  });
  const newState = reducer(
    state,
    { id: 32 }
  );
  t.deepEqual(
    newState,
    {
      list: ['zero', 'one', 'three'],
    }
  );
  t.end();
});
