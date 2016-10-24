import petiole from 'petiole';
import thunk from 'petiole-thunk';

export const {
  declareLeaf,
  createTree,
  createStore,
} = petiole(
  thunk,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
