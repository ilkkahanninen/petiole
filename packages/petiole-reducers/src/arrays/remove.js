const reject = require('lodash.reject');
const parseValue = require('../parseValue');

const remove = predicate => (state, action) => {
  const pred = parseValue(predicate, state, action);
  const newState = reject(state, pred);
  return state.length === newState.length
    ? state
    : newState;
};

module.exports = remove;