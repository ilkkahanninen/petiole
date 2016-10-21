const combineTree = require('./combineTree');
const createLeaf = require('./createLeaf');
const createStore = require('./createStore');

function initPetiole(...plugins) {
  return {
    combineTree: combineTree(plugins),
    createLeaf: createLeaf(plugins),
    createStore: createStore(plugins),
  };
}

module.exports = initPetiole;
module.exports.default = initPetiole;
