const mapValues = require('lodash.mapvalues');

const parseValue = (value, state, action) => {
  switch(typeof value) {
  case 'function': return value(state, action);
  case 'object': return mapValues(value, val => parseValue(val, state, action));
  default: return value;
  }
};

module.exports = parseValue;
