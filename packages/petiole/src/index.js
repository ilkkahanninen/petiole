const declareLeaf = require('./declareLeaf');
const createTree = require('./createTree');
const createOrphanLeaf = require('./createOrphanLeaf');
const createStore = require('./createStore');
const combineLeaflets = require('./combineLeaflets');
const pluginWrappers = require('./pluginWrappers');

function initPetiole(...plugins) {
  return {
    declareLeaf: declareLeaf(plugins),
    createTree: createTree(plugins),
    createStore: createStore(plugins),
    createOrphanLeaf,
    combineLeaflets,
  };
}

Object.assign(initPetiole, pluginWrappers);

module.exports = initPetiole;
module.exports.default = initPetiole;
