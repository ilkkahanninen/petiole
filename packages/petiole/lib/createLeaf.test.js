const test = require('tape');
const Immutable = require('seamless-immutable');
const createLeaf = require('./createLeaf');

const createTestLeaf = () => {
  const leaf = createLeaf({
    namespace: 'test',
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
      fetchItem: () => function(dispatch) {
        dispatch();
        setImmediate(() => {
          dispatch(this.addItem('fetched'));
          setImmediate(() => dispatch('ready'));
        });
      },
    },
    selectors: {
      itemCount: state => state.items.length,
      itemsBefore: (state, before) => (
        state.items.filter(item => item < before).length
      ),
    },
    reducer: {
      addItem(state, { item }) {
        return state.set('items', state.items.concat([ item ]));
      },
      'otherModule/setName': (state, { name }) => {
        return state.set('name', name);
      },
    },
  });

  leaf.setNamespace('test');
  return leaf;
};

test('createLeaf prefixes action types with leaf id', function (t) {
  const leaf = createTestLeaf();
  t.equal(leaf.actionTypes.addItem, 'test/addItem');
  t.end();
});

test('createLeaf reducer functions correctly', function(t) {
  const leaf = createTestLeaf();
  const state = leaf.reducer(
    Immutable({ items: [] }),
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

test('state stays immutable', function(t) {
  const leaf = createTestLeaf();
  const state = leaf.reducer(
    Immutable({ items: [] }),
    { type: 'test/addItem', item: 'foobar' }
  );
  state.foo = 'bar';
  t.equal(state.foo, undefined, 'assigned property to an immutable object does not exists');
  t.throws(
    () => state.items.push('xxx'),
    'immutable array cannot be mutated'
  );
  t.end();
});

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

test('function action creator is served with wrapped dispatcher', function(t) {
  const leaf = createTestLeaf();
  const action = leaf.actions.fetchItem();
  const expectations = [
    { type: 'test/fetchItem' },
    { type: 'test/addItem', item: 'fetched' },
    { type: 'test/ready' },
  ];
  t.plan(3);
  let index = 0;
  action(action => {
    t.deepEqual(action, expectations[index]);
    index++;
  });
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
