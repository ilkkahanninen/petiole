const declareLeaf = require('./declareLeaf');
const createTree = require('./createTree');
const createOrphanLeaf = require('./createOrphanLeaf');
const createStore = require('./createStore');

function initPetiole(...plugins) {
  return {
    declareLeaf: declareLeaf(plugins),
    createTree: createTree(plugins),
    createOrphanLeaf: createOrphanLeaf,
    createStore: createStore(plugins),
  };
}

module.exports = initPetiole;
module.exports.default = initPetiole;
