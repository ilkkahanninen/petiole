const Immutable = require('seamless-immutable');
const mapKeys = require('lodash.mapkeys');
const mapValues = require('lodash.mapvalues');
const zipObject = require('lodash.zipobject');
const get = require('lodash.get');
const memoize = require('./memoize');

function createLeaf({
  initialState = {},
  actions = {},
  selectors = {},
  reducer = {},
  actionTypes = [],
}) {

  let namespace, namespaceArray, reducerFuncs;

  const leaf = {
    __isLeaf: true,
    setNamespace(name) {
      namespace = name;
      namespaceArray = name.split('/');

      // Map prefixed action type names to reducer functions
      reducerFuncs = mapKeys(reducer, (func, name) => actionName(name));

      // Prefix action types with leaf namespace
      const typeNames = Object.keys(actions)
        .concat(Object.keys(reducer))
        .concat(actionTypes)
        .filter(name => name.indexOf('/') < 0);
      leaf.actionTypes = zipObject(
        typeNames,
        typeNames.map(actionName)
      );
    },
  };

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


  // Create main reducer function
  leaf.reducer = (state = Immutable(initialState), action) => {
    const { type } = action;
    if (reducerFuncs[type]) {
      return reducerFuncs[type].call(null, state, action);
    }
    return state;
  };

  // Create action creators
  leaf.actions = mapValues(
    actions,
    (actionCreator, name) => {
      // Boolean -> simple action creators
      if (typeof actionCreator === 'boolean') {
        return () => Immutable({ type: actionName(name) });
      }

      // Strings -> simple action creatos with one argument
      if (typeof actionCreator === 'string') {
        return arg => Immutable({
          type: actionName(name),
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
          { type: actionName(name) }
        ));
      }

      // Objects -> simplea action creator with fixed payload
      if (typeof actionCreator === 'object') {
        return () => ensureActionType(actionCreator, actionName(name));
      }

      // Functions -> assume redux-thunk, wrap with custom dispatcher
      if (typeof actionCreator === 'function') {
        return (...args) => {
          return (dispatch, ...other) => {
            return actionCreator(...args).call(
              leaf.actions,
              action => {
                if (!action) {
                  return dispatch({ type: actionName(name) });
                }
                return typeof action === 'string'
                  ? dispatch({ type: actionName(action) })
                  : dispatch(ensureActionType(action, actionName(name)));
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
  leaf.selectors = mapValues(
    selectors,
    selector => memoize(
      (state, ...rest) => selector(
        get(state, namespaceArray),
        ...rest
      )
    )
  );

  // Utility to get state branch associated to this leaf
  leaf.select = state => get(state, namespaceArray);

  return leaf;
}

module.exports = createLeaf;
