import petiole from 'petiole';
import thunk from 'petiole-thunk';
import devtools from 'petiole-devtools-extension';

const d = petiole.enhancer(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__);
console.log(devtools);
console.log(d);
console.log(devtools.reduxEnhancer === d.reduxEnhancer);

export const {
  declareLeaf,
  createTree,
  createStore,
} = petiole(
  thunk,
  devtools
);
