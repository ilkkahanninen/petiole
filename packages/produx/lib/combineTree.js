const mapValues = require('lodash.mapvalues');
const { combineReducers } = require('redux');

function buildTree(structure, path = '') {
  return mapValues(structure, (node, name) => {
    const thisPath = path ? `${path}/${name}` : name;
    if (node.__isLeaf) {
      if (node.namespace) {
        throw new Error(`A leaf (${node.namespace}) can be added only to one tree`);
      }
      node.setNamespace(thisPath);
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
          ? node.reducer
          : extractReducers(node)
      )
    )
  );
}

module.exports = function combineTree(structure) {
  const tree = buildTree(structure);
  const reducer = extractReducers(tree);
  return {
    reducer,
  };
};
