
const { createStore, applyMiddleware } = require('redux');
const isFunction = fn => typeof fn === 'function';

module.exports = function createCreateStore(plugins = []) {
  return function createReduxStore(tree, options = {}) {
    const {
      preloadedState = {},
    } = options;

    const middleware = plugins
      .map(plugin => plugin.reduxMiddleware ? plugin.reduxMiddleware : plugin)
      .filter(isFunction);

    return createStore(
      tree.reducer,
      preloadedState,
      applyMiddleware.apply(null, middleware)
    );
  };
};
