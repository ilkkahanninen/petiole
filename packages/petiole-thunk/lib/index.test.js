const test = require('tape');
const petiole = require('petiole');
const thunk = require('./index');

const { declareLeaf, createTree, createStore } = petiole(thunk);

test('plugin works', function(t) {
  const leaf = declareLeaf({
    initialState: {
      run: false,
      ready: false,
    },
    actions: {
      run() {
        return function(dispatch) {
          dispatch();
          setImmediate(this.ready);
        };
      },
      ready: true,
    },
    reducer: {
      run: state => state.set('run', true),
      ready: state => state.set('ready', true),
    },
  });

  const tree = createTree({ leaf });
  const store = createStore(tree);

  t.plan(2);
  let index = 0;
  store.subscribe(() => {
    t.deepEqual(
      store.getState(),
      { leaf: { run: true, ready: !!index } }
    );
    index++;
  });
  store.dispatch(leaf.actions.run());
});