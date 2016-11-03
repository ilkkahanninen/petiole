
const pluck = prop => (state, action) => action[prop];
module.exports = pluck;