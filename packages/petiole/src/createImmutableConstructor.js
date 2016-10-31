const { IMMUTABLE } = require('./pluginWrappers');

const immutableStub = a => a;
immutableStub.isImmutable = () => true;

function createImmutableConstructor(plugins) {
  const immutablePlugins = plugins
    .map(plugin => plugin[IMMUTABLE])
    .filter(fn => typeof fn === 'function');

  switch (immutablePlugins.length) {
  case 0: {
    // No auto immutable -> return identity function
    return immutableStub;
  }
  case 1: {
    // Return immutable constructor from the plugin
    return immutablePlugins[0];
  }
  default: {
    throw new Error('More than one immutable creator plugins loaded. Only one can be loaded at time.');
  }
  }
}

module.exports = createImmutableConstructor;
