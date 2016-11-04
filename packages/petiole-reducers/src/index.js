module.exports = {

  // Object reducers
  merge: require('./objects/merge'),
  replace: require('./objects/replace'),

  // Number reducers
  add: require('./numbers/add'),
  subtract: require('./numbers/subtract'),

  // Array reducers
  push: require('./arrays/push'),
  pushMany: require('./arrays/pushMany'),
  remove: require('./arrays/remove'),
  removeAtIndex: require('./arrays/removeAtIndex'),

  // Type agnostic reducers
  pluck: require('./type-agnostic/pluck'),

};