const mapValues = require('lodash.mapvalues');
const updatesObject = require('./updatesObject');

const merge = obj => (state, action) => {
  const newState = mapValues(obj, (value, prop) => {
    const deeperState = state != null ? state[prop] : null;
    switch (typeof value) {
    case 'object': return merge(value)(deeperState, action);
    case 'function': return value(deeperState, action);
    default: return value;
    }
  });
  return updatesObject(state, newState)
    ? Object.assign({}, state, newState)
    : state;
};

module.exports = merge;
