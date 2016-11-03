const parseValue = require('../parseValue');

const push = value => (state, action) => {
  const val = parseValue(value, state, action);
  return Array.isArray(state)
    ? state.concat(val)
    : [val];
};

module.exports = push;