const parseValue = require('../parseValue');
const ensureArray = a => Array.isArray(a) ? a : [a];

const pushMany = values => (state, action) => {
  const vals = ensureArray(
    typeof values === 'function'
      ? values(state, action)
      : values
  ).map(v => parseValue(v, state, action));
  return Array.isArray(state)
    ? state.concat(...vals)
    : vals;
};

module.exports = pushMany;