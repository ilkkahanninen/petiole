const mapValues = require('lodash.mapvalues');
const isEqual = require('lodash.isequal');

const replace = obj => (state, action) => {
  const newState = mapValues(obj, (value, prop) => {
    const deeperState = state != null ? state[prop] : null;
    switch (typeof value) {
    case 'object': return replace(value)(deeperState, action);
    case 'function': return value(deeperState, action);
    default: return value;
    }
  });
  return isEqual(state, newState)
    ? state
    : newState;
};

module.exports = replace;
