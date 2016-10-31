// Boolean -> simple action creators
function buildFromBool({ declaration, name, mapActionType }) {
  if (typeof declaration === 'boolean') {
    return () => ({ type: mapActionType(name) });
  }
  return null;
}

// Strings -> simple action creatos with one argument
function buildFromString({ declaration, name, mapActionType }) {
  if (typeof declaration === 'string') {
    return arg => ({
      type: mapActionType(name),
      [declaration]: arg,
    });
  }
  return null;
}

// Arrays -> simple action creators with multiple arguments
function buildFromArray({ declaration, name, mapActionType }) {
  if (Array.isArray(declaration)) {
    return (...args) => declaration.reduce(
      (result, key, index) => Object.assign(
        result,
        { [key]: args[index] }
      ),
      { type: mapActionType(name) }
    );
  }
  return null;
}

// Objects -> simplea action creator with fixed payload
function buildFromObject({ declaration, name, mapActionType }) {
  if (typeof declaration === 'object') {
    return () => ensureActionType(declaration, name, mapActionType);
  }
  return null;
}

// Utils
function ensureActionType(action, type, mapActionType) {
  return Object.assign(
    {},
    action,
    {
      type: action.type ? mapActionType(action.type) : mapActionType(type),
    }
  );
}


module.exports = [
  buildFromBool,
  buildFromString,
  buildFromArray,
  buildFromObject,
];
