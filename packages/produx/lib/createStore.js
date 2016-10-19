
const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;

const defaultEnhancers = () => {
  const enhancers = [
    thunk,
  ];
  if ((typeof window !== 'undefined') && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }
  return enhancers;
};

module.exports = (tree, preloadedState = {}, enhancers = defaultEnhancers()) => {
  return createStore(
    tree.reducer,
    preloadedState,
    applyMiddleware.apply(null, enhancers)
  );
};
