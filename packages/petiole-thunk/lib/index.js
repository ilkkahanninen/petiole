const thunk = require('redux-thunk').default;

function ensureActionType (action, type, getActionType) {
  return Object.assign(
    {},
    action,
    {
      type: action.type ? getActionType(action.type) : getActionType(type),
    }
  );
}

function buildActionCreatorFromFunction(fn, name, getActionType, createContext) {
  if (typeof fn === 'function') {
    return (...args) => {
      return (dispatch, ...other) => {
        return fn(...args).call(
          createContext(dispatch),
          action => {
            if (!action) {
              return dispatch({ type: getActionType(name) });
            }
            return typeof action === 'string'
              ? dispatch({ type: getActionType(action) })
              : dispatch(ensureActionType(action, name, getActionType));
          },
          ...other
        );
      };
    };
  }
  return null;
}

module.exports = {
  actionCreatorBuilder: buildActionCreatorFromFunction,
  reduxMiddleware: thunk,
};
