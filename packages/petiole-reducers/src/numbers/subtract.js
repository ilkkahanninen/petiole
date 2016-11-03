
const subtract = value => (state, action) => (
  state - (typeof value === 'function' ? value(state, action) : value)
);

module.exports = subtract;
