const test = require('tape');
const declareLeaf = require('./declareLeaf')();
const createOrphanLeaf = require('./createOrphanLeaf');

const set = (state, prop, value) => Object.assign({}, state, { [prop]: value });

const createTestLeaf = () => {
  const leaf = declareLeaf({
    initialState: {
      items: [],
    },
    actions: {
      toggle: true,
      trigger: 'value',
      touch: { time: 'hammer' },
      turnOn: { type: 'turn', value: true },
      turnOff: { type: 'turn', value: false },
      addItem: ['item'],
    },
    selectors: {
      itemCount: state => state.items.length,
      itemsBefore: (state, before) => (
        state.items.filter(item => item < before).length
      ),
    },
    reducer: {
      addItem(state, { item }) {
        return set(state, 'items', state.items.concat([ item ]));
      },
      'otherModule/setName': (state, { name }) => set(state, 'name', name),
    },
  });

  return createOrphanLeaf(leaf, 'test');
};

test('createLeaf prefixes action types with leaf id', function (t) {
  const leaf = createTestLeaf();
  t.equal(leaf.actionTypes.addItem, 'test/addItem');
  t.end();
});

test('createLeaf reducer functions correctly', function(t) {
  const leaf = createTestLeaf();
  const state = leaf.reducer(
    { items: [] },
    { type: 'test/addItem', item: 'foobar' }
  );
  t.equal(state.items.length, 1, 'items list has correct number of items');
  t.equal(state.items[0], 'foobar', 'item list has correct item');

  const state2 = leaf.reducer(
    state,
    { type: 'otherModule/setName', name: 'Hessu' }
  );
  t.equal(state2.items, state.items, 'array in previous state persists');
  t.equal(state2.name, 'Hessu', 'reducer has changed state according to external action type');
  t.end();
});

// test('state stays immutable', function(t) {
//   const leaf = createTestLeaf();
//   const state = leaf.reducer(
//     { items: [] },
//     { type: 'test/addItem', item: 'foobar' }
//   );
//   state.foo = 'bar';
//   t.equal(state.foo, undefined, 'assigned property to an immutable object does not exists');
//   t.throws(
//     () => state.items.push('xxx'),
//     'immutable array cannot be mutated'
//   );
//   t.end();
// });

test('boolean defines a very simple action creator', function(t) {
  const leaf = createTestLeaf();
  const action = leaf.actions.toggle();
  t.deepEqual(
    action,
    { type: 'test/toggle' },
    'simple action created'
  );
  t.end();
});

test('string defines a very simple action creator', function(t) {
  const leaf = createTestLeaf();
  const action = leaf.actions.trigger('happy');
  t.deepEqual(
    action,
    { type: 'test/trigger', value: 'happy' },
    'simple action created'
  );
  t.end();
});

test('array defines a simple action creator with arguments', function(t) {
  const leaf = createTestLeaf();
  const action = leaf.actions.addItem('trumpet');
  t.deepEqual(
    action,
    { type: 'test/addItem', item: 'trumpet' },
    'simple action created'
  );
  t.end();
});

test('object defines a simple action creator with fixed payload', function(t) {
  const leaf = createTestLeaf();
  const action = leaf.actions.touch();
  t.deepEqual(
    action,
    { type: 'test/touch', time: 'hammer' },
    'simple action created'
  );
  const action2 = leaf.actions.turnOn();
  t.deepEqual(
    action2,
    { type: 'test/turn', value: true },
    'simple action created'
  );
  t.end();
});

test('selector uses namespace to select correct branch of state', function(t) {
  const leaf = createTestLeaf();
  const state = {
    test: {
      items: [1, 2, 3],
    },
  };

  t.equal(leaf.selectors.itemCount(state), 3);
  t.equal(leaf.selectors.itemsBefore(state, 3), 2);
  t.end();
});

test('passing multiple leaflets to declareLeaf automatically combines them', function(t) {
  const partialLeaf = declareLeaf(
    { actionTypes: ['foo'] },
    { actionTypes: ['bar'] }
  );
  const leaf = createOrphanLeaf(partialLeaf, 'test');
  t.equal(leaf.actionTypes.foo, 'test/foo');
  t.equal(leaf.actionTypes.bar, 'test/bar');
  t.end();
});
