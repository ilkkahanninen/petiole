
const add = value => (state, action) => (
  state + (typeof value === 'function' ? value(state, action) : value)
);

module.exports = add;
