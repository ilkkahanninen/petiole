
const removeAtIndex = index => (state, action) => {
  const idx = typeof index === 'function' ? index(state, action) : index;
  return state.slice(0, idx).concat(state.slice(idx + 1));
};

module.exports = removeAtIndex;
