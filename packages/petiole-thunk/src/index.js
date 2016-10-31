const thunk = require('redux-thunk').default;

function ensureActionType(action, type, getActionType) {
  return Object.assign(
    {},
    action,
    {
      type: action.type ? getActionType(action.type) : getActionType(type),
    }
  );
}

function buildActionCreatorFromFunction({
    declaration,
    name,
    mapActionType,
    createContext,
  }) {
  if (typeof declaration === 'function') {
    return (...args) => {
      return (dispatch, ...other) => {
        return declaration(...args).call(
          createContext(dispatch),
          action => {
            if (!action) {
              return dispatch({ type: mapActionType(name) });
            }
            return typeof action === 'string'
              ? dispatch({ type: mapActionType(action) })
              : dispatch(ensureActionType(action, name, mapActionType));
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
