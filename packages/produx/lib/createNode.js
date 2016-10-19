const Immutable = require('seamless-immutable');
const mapKeys = require('lodash.mapkeys');
const mapValues = require('lodash.mapvalues');
const zipObject = require('lodash.zipobject');
const memoize = require('./memoize');

function createNode({
  namespace = 'global',
  initialState = {},
  actions = {},
  selectors = {},
  reducer = {},
  actionTypes = [],
}) {

  const node = {};

  // Helper utils
  const actionName = name => (
    name.indexOf('/') < 0
      ? `${namespace}/${name}`
      : name
  );

  const ensureActionType = (action, type) => Immutable(
    Object.assign(
      {},
      action,
      {
        type: action.type ? actionName(action.type) : type,
      }
    )
  );

  // Prefix action types with node id
  const typeNames = Object.keys(actions)
    .concat(Object.keys(reducer))
    .concat(actionTypes)
    .filter(name => name.indexOf('/') < 0);
  node.actionTypes = zipObject(
    typeNames,
    typeNames.map(actionName)
  );

  // Map prefixed action type names to reducer functions
  const reducerFuncs = mapKeys(reducer, (func, name) => actionName(name));

  // Create main reducer function
  node.reducer = (state = Immutable(initialState), action) => {
    const { type } = action;
    if (reducerFuncs[type]) {
      return reducerFuncs[type].call(null, state, action);
    }
    return state;
  };

  // Create action creators
  node.actions = mapValues(
    actions,
    (actionCreator, name) => {
      const type = actionName(name);

      // Boolean -> simple action creators
      if (typeof actionCreator === 'boolean') {
        return () => Immutable({ type });
      }

      // Strings -> simple action creatos with one argument
      if (typeof actionCreator === 'string') {
        return arg => Immutable({
          type,
          [actionCreator]: arg,
        });
      }

      // Arrays -> simple action creators with multiple arguments
      if (Array.isArray(actionCreator)) {
        return (...args) => Immutable(actionCreator.reduce(
          (result, key, index) => Object.assign(
            result,
            { [key]: args[index] }
          ),
          { type }
        ));
      }

      // Objects -> simplea action creator with fixed payload
      if (typeof actionCreator === 'object') {
        const payload = ensureActionType(actionCreator, type);
        return () => payload;
      }

      // Functions -> assume redux-thunk, wrap with custom dispatcher
      if (typeof actionCreator === 'function') {
        return (...args) => {
          return (dispatch, ...other) => {
            return actionCreator(...args).call(
              node.actions,
              action => {
                if (!action) {
                  return dispatch({ type });
                }
                return typeof action === 'string'
                  ? dispatch({ type: actionName(action) })
                  : dispatch(ensureActionType(action, type));
              },
              ...other
            );
          };
        };
      }

      // TODO: Promises


      return actionCreator;
    }
  );

  // Map selectors
  node.selectors = mapValues(
    selectors,
    selector => memoize(
      (state, ...rest) => selector(state[namespace], ...rest)
    )
  );

  return node;
}

module.exports = createNode;
