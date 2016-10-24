
function createOrphanLeaf(leaf, namespace = 'global') {
  if (!leaf.__isLeaf || !leaf.__leafWillMountTo || !leaf.__leafDidMount) {
    throw new Error('Argument is not a partially created leaf.');
  }
  leaf.__leafWillMountTo(namespace);
  leaf.__leafDidMount();
  return leaf;
}

module.exports = createOrphanLeaf;
