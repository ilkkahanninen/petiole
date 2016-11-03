module.exports = {

  // Object reducers
  merge: require('./objects/merge'),
  replace: require('./objects/replace'),

  // Number reducers
  add: require('./numbers/add'),
  subtract: require('./numbers/subtract'),

  // Array reducers

  // Type agnostic reducers
  pluck: require('./type-agnostic/pluck'),

};