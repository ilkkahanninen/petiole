import { declareLeaf } from './petiole';
import { remove } from 'ramda';

export default declareLeaf({
  initialState: {
    name: 'My TODO list',
    list: [
      'Write better documentation',
      'Create more examples',
    ],
  },
  actions: {
    setName: 'name',
    addItem: 'item',
    removeItem: 'index',
  },
  selectors: {
    itemCount: state => state.list.length,
  },
  reducer: {
    name(state, { name }) {
      return state.set('name', name);
    },
    addItem(state, { item }) {
      return {
        ...state,
        list: state.list.concat(item)
      };
    },
    removeItem(state, { index }) {
      return {
        ...state,
        list: remove(index, 1, state.list)
      };
    },
  }
});
