import { createStore } from './petiole';
import items from './items';

const store = createStore({
  items,
});

store.dispatch(items.actions.setName('New TODO App'));

export default store;
