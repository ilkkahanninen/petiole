const test = require('tape');
const combineTree = require('./combineTree')();
const createLeaf = require('./createLeaf')();
const createStore = require('./createStore')();

test('building a tree works', function(t) {
  const users = createLeaf({
    initialState: {
      list: ['John', 'Mary']
    },
  });

  const dinnerTable = createLeaf({
    initialState: {
      chairs: [],
      isSetUp: false,
    },
    actions: {
      addChair: 'name',
    },
    reducer: {
      addChair: (state, { name }) => state.set('chairs', state.chairs.concat(name)),
    },
    selectors: {
      chairCount: state => state.chairs.length,
    }
  });

  const tree = combineTree({
    users,
    kitchen: {
      dinnerTable,
    },
  });

  const store = createStore(tree);

  store.dispatch(dinnerTable.actions.addChair('A'));
  store.dispatch(dinnerTable.actions.addChair('B'));

  t.deepEqual(store.getState().kitchen.dinnerTable, { chairs: ['A', 'B'], isSetUp: false });
  t.equal(dinnerTable.selectors.chairCount(store.getState()), 2, 'Selector works');
  t.deepEqual(users.select(store.getState()), { list: ['John', 'Mary'] }, 'select() works');

  t.end();
});

test('cross-linking actions between leaves works', function(t) {
  const leafA = createLeaf({
    actions: {
      trigger: true,
    },
  });

  const leafB = createLeaf({
    initialState: {
      value: false,
    },
    reducer: {
      '/externalTrigger': [
        () => leafA.actionTypes.trigger,
        state => state.set('value', true),
      ],
    },
  });

  const tree = combineTree({
    a: leafA,
    b: leafB,
  });
  const store = createStore(tree);

  store.dispatch(leafA.actions.trigger());
  t.deepEqual(store.getState(), {a: {}, b: {value: true}}, 'triggering an action in leaf A caused a mutation in leaf B');

  t.end();
});