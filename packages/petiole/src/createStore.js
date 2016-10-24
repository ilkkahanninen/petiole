const { createStore, applyMiddleware, compose } = require('redux');
const { REDUX_MIDDLEWARE, REDUX_ENHANCER } = require('./pluginWrappers');

const isFunction = fn => typeof fn === 'function';
const pickFunctions = (plugins, prop) => plugins
      .map(plugin => plugin[prop])
      .filter(isFunction);

module.exports = function createCreateStore(plugins = []) {
  return function createReduxStore(tree, options = {}) {
    const {
      preloadedState = {},
    } = options;

    const middleware = pickFunctions(plugins, REDUX_MIDDLEWARE);
    const enhancers = pickFunctions(plugins, REDUX_ENHANCER);

    const enhancer = compose(
      applyMiddleware(...middleware),
      ...enhancers
    );

    return createStore(
      tree.reducer,
      preloadedState,
      enhancer
    );
  };
};
