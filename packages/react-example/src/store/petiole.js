import petiole from 'petiole';
import thunk from 'petiole-thunk';
import devtools from 'petiole-devtools-extension';
import immutable from 'petiole-seamless-immutable';

export const {
  declareLeaf,
  createStore,
} = petiole(
  thunk,
  immutable,
  devtools
);
