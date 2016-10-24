import { createTree, createStore } from './petiole';
import items from './items';

const tree = createTree({
  items,
});

const store = createStore(tree);

export default store;
