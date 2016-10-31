const Immutable = require('immutable');

const plugin = {
  Immutable: Immutable,
  immutable: Immutable.fromJS,
  testImmutable: n => n instanceof Immutable.Collection
};

module.exports = plugin;
