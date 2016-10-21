const Immutable = require('seamless-immutable');

// Boolean -> simple action creators
function buildFromBool(actionCreator, name, getActionType) {
  if (typeof actionCreator === 'boolean') {
    return () => Immutable({ type: getActionType(name) });
  }
  return null;
}

// Strings -> simple action creatos with one argument
function buildFromString(actionCreator, name, getActionType) {
  if (typeof actionCreator === 'string') {
    return arg => Immutable({
      type: getActionType(name),
      [actionCreator]: arg,
    });
  }
  return null;
}

// Arrays -> simple action creators with multiple arguments
function buildFromArray(actionCreator, name, getActionType) {
  if (Array.isArray(actionCreator)) {
    return (...args) => Immutable(actionCreator.reduce(
      (result, key, index) => Object.assign(
        result,
        { [key]: args[index] }
      ),
      { type: getActionType(name) }
    ));
  }
  return null;
}

// Objects -> simplea action creator with fixed payload
function buildFromObject(actionCreator, name, getActionType) {
  if (typeof actionCreator === 'object') {
    return () => ensureActionType(actionCreator, name, getActionType);
  }
  return null;
}

// Utils
function ensureActionType (action, type, getActionType) {
  return Object.assign(
    {},
    action,
    {
      type: action.type ? getActionType(action.type) : getActionType(type),
    }
  );
}


module.exports = [
  buildFromBool,
  buildFromString,
  buildFromArray,
  buildFromObject,
];
