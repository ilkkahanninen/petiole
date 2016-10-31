const mapValues = require('lodash.mapvalues');

function combineObject(leaf, leaflet, context) {
  const src = leaflet[context];
  if (!src) {
    return leaf;
  }
  const trg = leaf[context];
  mapValues(src, (value, key) => {
    if (trg[key]) {
      throw new Error(`Conflict when combining leaflets: '${key}' defined twice in ${context}`);
    }
    trg[key] = src[key];
  });
}

function combineArray(leaf, leaflet, context) {
  const src = leaflet[context];
  if (!src) {
    return leaf;
  }
  const trg = leaf[context];
  src.forEach(value => {
    if (trg.indexOf(value) >= 0) {
      throw new Error(`Conflict when combining leaflets: '${value}' defined twice in ${context}`);
    }
    trg.push(value);
  });
}

function combineLeaflets(...leaflets) {
  return leaflets.reduce(
    (leaf, leaflet) => {
      combineObject(leaf, leaflet, 'initialState');
      combineObject(leaf, leaflet, 'actions');
      combineObject(leaf, leaflet, 'selectors');
      combineObject(leaf, leaflet, 'reducer');
      combineArray(leaf, leaflet, 'actionTypes');
      return leaf;
    },
    {
      initialState: {},
      actions: {},
      selectors: {},
      reducer: {},
      actionTypes: [],
    }
  );
}

module.exports = combineLeaflets;
