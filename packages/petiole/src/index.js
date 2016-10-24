const declareLeaf = require('./declareLeaf');
const createTree = require('./createTree');
const createOrphanLeaf = require('./createOrphanLeaf');
const createStore = require('./createStore');
const pluginWrappers = require('./pluginWrappers');

function initPetiole(...plugins) {
  return {
    declareLeaf: declareLeaf(plugins),
    createTree: createTree(plugins),
    createOrphanLeaf: createOrphanLeaf,
    createStore: createStore(plugins),
  };
}

Object.assign(initPetiole, pluginWrappers);

module.exports = initPetiole;
module.exports.default = initPetiole;
