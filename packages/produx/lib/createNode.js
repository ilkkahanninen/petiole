const Immutable = require('seamless-immutable');

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
  node.actionTypes = Object.keys(actions)
    .concat(Object.keys(reducer))
    .concat(actionTypes)
    .filter(name => name.indexOf('/') < 0)
    .reduce(
      (types, type) => Object.assign(types, { [type]: actionName(type) }),
      {}
    );

  // Map prefixed action type names to reducer functions
  const reducerFuncs = Object.keys(reducer).reduce(
    (funcs, name) => {
      const prefixedName = actionName(name);
      return Object.assign(funcs, {
        [prefixedName]: reducer[name],
      });
    },
    {}
  );

  // Create main reducer function
  node.reducer = (state = Immutable(initialState), action) => {
    const { type } = action;
    if (reducerFuncs[type]) {
      return reducerFuncs[type].call(null, state, action);
    }
    return state;
  };

  // Create action creators
  node.actions = Object.keys(actions).reduce(
    (acts, name) => {
      const actionCreator = actions[name];
      let func;
      const type = actionName(name);

      // Boolean -> simple action creators
      if (typeof actionCreator === 'boolean') {
        func = () => Immutable({ type });
      }

      // Strings -> simple action creatos with one argument
      else if (typeof actionCreator === 'string') {
        func = arg => Immutable({
          type,
          [actionCreator]: arg,
        });
      }

      // Arrays -> simple action creators with multiple arguments
      else if (Array.isArray(actionCreator)) {
        func = (...args) => Immutable(actionCreator.reduce(
          (result, key, index) => Object.assign(
            result,
            { [key]: args[index] }
          ),
          { type }
        ));
      }

      // Objects -> simplea action creator with fixed payload
      else if (typeof actionCreator === 'object') {
        const payload = ensureActionType(actionCreator, type);
        func = () => payload;
      }

      // Functions -> assume redux-thunk, wrap with custom dispatcher
      else if (typeof actionCreator === 'function') {
        func = (...args) => {
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

      else {
        console.warn(`Invalid action declaration for ${name}`);
      }

      return func
        ? Object.assign(acts, { [name]: func })
        : acts;
    },
    {}
  );

  return node;
}

module.exports = createNode;
