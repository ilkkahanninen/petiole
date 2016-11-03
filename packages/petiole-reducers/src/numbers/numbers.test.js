const test = require('tape');
const merge = require('../objects/merge');
const pluck = require('../type-agnostic/pluck');
const add = require('./add');
const subtract = require('./subtract');

test('add: adds correctly', function(t) {
  const state = {
    counter: 1,
    value: 5,
  };
  const reducer = merge({
    counter: add(1),
    value: add(pluck('value'))
  });
  const newState = reducer(state, { value: 2 });
  t.deepEqual(newState, { counter: 2, value: 7 });
  t.end();
});

test('subtract: subtracts correctly', function(t) {
  const state = {
    counter: 10,
    value: 10,
  };
  const reducer = merge({
    counter: subtract(1),
    value: subtract(pluck('value')),
  });
  const newState = reducer(state, { value: 2 });
  t.deepEqual(newState, { counter: 9, value: 8 });
  t.end();
});