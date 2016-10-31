const test = require('tape');
const petiole = require('petiole');
const immutable = require('./index');
const { isImmutable } = require('seamless-immutable');

const { declareLeaf, createStore } = petiole(immutable);

test('creates immutable state', function(t) {
  const leaf = declareLeaf({
    initialState: {
      list: [0, 1, 2]
    }
  });
  const store = createStore({ leaf });
  const state = store.getState();

  t.true(isImmutable(state.leaf));
  t.true(isImmutable(state.leaf.list));
  t.end();
});
