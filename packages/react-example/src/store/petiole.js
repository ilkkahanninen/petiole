import petiole from 'petiole';
import thunk from 'petiole-thunk';

export const {
  declareLeaf,
  createTree,
  createStore,
} = petiole(
  thunk,
  petiole.enhancer(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
);
