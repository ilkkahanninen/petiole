import { declareLeaf } from './petiole';
import {
  merge,
  push,
  pluck,
  removeAtIndex
} from 'petiole-reducers';

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
    setName: merge({
      name: pluck('name'),
    }),
    addItem: merge({
      list: push(pluck('item')),
    }),
    removeItem: merge({
      list: removeAtIndex(pluck('index')),
    }),
  }
});
