const Immutable = require('seamless-immutable');

const plugin = {
  Immutable: Immutable,
  immutable: Immutable,
  testImmutable: Immutable.isImmutable
};

module.exports = plugin;
