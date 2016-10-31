import petiole from 'petiole';
import thunk from 'petiole-thunk';
import devtools from 'petiole-devtools-extension';

export const {
  declareLeaf,
  createTree,
  createStore,
} = petiole(
  thunk,
  devtools
);
