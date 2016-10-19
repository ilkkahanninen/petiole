const test = require('tape');
const Immutable = require('seamless-immutable');
const createNode = require('./createNode');

const createTestNode = () => createNode({
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
  reducer: {
    addItem(state, { item }) {
      return state.set('items', state.items.concat([ item ]));
    },
    'otherModule/setName': (state, { name }) => {
      return state.set('name', name);
    },
  },
});

test('createNode prefixes action types with node id', function (t) {
  const node = createTestNode();
  t.equal(node.actionTypes.addItem, 'test/addItem');
  t.end();
});

test('createNode reducer functions correctly', function(t) {
  const node = createTestNode();
  const state = node.reducer(
    Immutable({ items: [] }),
    { type: 'test/addItem', item: 'foobar' }
  );
  t.equal(state.items.length, 1, 'items list has correct number of items');
  t.equal(state.items[0], 'foobar', 'item list has correct item');

  const state2 = node.reducer(
    state,
    { type: 'otherModule/setName', name: 'Hessu' }
  );
  t.equal(state2.items, state.items, 'array in previous state persists');
  t.equal(state2.name, 'Hessu', 'reducer has changed state according to external action type');
  t.end();
});

test('state stays immutable', function(t) {
  const node = createTestNode();
  const state = node.reducer(
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
  const node = createTestNode();
  const action = node.actions.toggle();
  t.deepEqual(
    action,
    { type: 'test/toggle' },
    'simple action created'
  );
  t.end();
});

test('string defines a very simple action creator', function(t) {
  const node = createTestNode();
  const action = node.actions.trigger('happy');
  t.deepEqual(
    action,
    { type: 'test/trigger', value: 'happy' },
    'simple action created'
  );
  t.end();
});

test('array defines a simple action creator with arguments', function(t) {
  const node = createTestNode();
  const action = node.actions.addItem('trumpet');
  t.deepEqual(
    action,
    { type: 'test/addItem', item: 'trumpet' },
    'simple action created'
  );
  t.end();
});

test('object defines a simple action creator with fixed payload', function(t) {
  const node = createTestNode();
  const action = node.actions.touch();
  t.deepEqual(
    action,
    { type: 'test/touch', time: 'hammer' },
    'simple action created'
  );
  const action2 = node.actions.turnOn();
  t.deepEqual(
    action2,
    { type: 'test/turn', value: true },
    'simple action created'
  );
  t.end();
});

test('function action creator is served with wrapped dispatcher', function(t) {
  const node = createTestNode();
  const action = node.actions.fetchItem();
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
