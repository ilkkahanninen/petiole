const test = require('tape');
const combineTree = require('./combineTree');
const createLeaf = require('./createLeaf');
const createStore = require('./createStore');

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
  t.equal(dinnerTable.selectors.chairCount(store.getState()), 2, 'Selector works')

  t.end();
});
