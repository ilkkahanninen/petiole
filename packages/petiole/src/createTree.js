const mapValues = require('lodash.mapvalues');
const { combineReducers } = require('redux');
const definePrivateProperty = require('./definePrivateProperty');

function buildTree(structure, path = '') {
  return mapValues(structure, (node, name) => {
    const thisPath = path ? `${path}/${name}` : name;
    if (node.__isLeaf) {
      if (node.namespace) {
        throw new Error(`A leaf (${node.namespace}) can be added only to one tree`);
      }
      node.__leafWillMountTo(thisPath);
      return node;
    }
    return buildTree(node, thisPath);
  });
}

function extractReducers(tree) {
  return combineReducers(
    mapValues(
      tree,
      node => (
        node.__isLeaf
          ? (node.__leafDidMount(), node.reducer)
          : extractReducers(node)
      )
    )
  );
}

module.exports = function createTree(structure) {
  const tree = buildTree(structure);
  const reducer = extractReducers(tree);
  const result = {
    reducer,
  };
  definePrivateProperty(result, '__isTree');
  return result;
};
