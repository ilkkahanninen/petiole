const test = require('tape');
const petiole = require('./index');

function createTestStore(...plugins) {
  const instance = petiole(...plugins);
  const counter = instance.declareLeaf({
    initialState: {
      value: 0,
    },
    actions: {
      increase: true,
    },
    reducer: {
      increase: state => state.set('value', state.value + 1),
    }
  });
  const tree = instance.createTree({
    counter,
  });
  const store = instance.createStore(tree);
  return {
    counter,
    store
  };
}

test('middleware insertion works', function(t) {

  const middleware = () => next => action => {
    t.equal(action.type, 'counter/increase', 'middleware is run & catches a correct action');
    return next(action);
  };

  const { counter, store } = createTestStore(
    petiole.middleware(middleware)
  );

  t.plan(1);
  store.dispatch(counter.actions.increase());
});

test('enhancer composition works', function(t) {

  function customEnhancer() {
    return function (createStore) {
      return function (reducer, preloadedState, enhancer) {
        var store = createStore(reducer, preloadedState, enhancer);
        var _dispatch = store.dispatch;
        return Object.assign({}, store, {
          dispatch(...args) {
            t.pass('enhancer run');
            return _dispatch(...args);
          }
        });
      };
    };
  }

  const { counter, store } = createTestStore(
    petiole.enhancer(customEnhancer())
  );

  t.plan(1);
  store.dispatch(counter.actions.increase());
});
