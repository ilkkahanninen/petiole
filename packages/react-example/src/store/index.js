import { createTree, createStore } from './petiole';
import items from './items';

const tree = createTree({
  items,
});

const store = createStore(tree);

console.log('xxx');
store.dispatch(items.actions.setName('fdfdsfds'));

export default store;
