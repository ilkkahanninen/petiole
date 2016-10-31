# petiole-immutable

Wraps state in Petiole store automatically to Immutable.js data structures.

See [Immutable.js website](https://facebook.github.io/immutable-js/) for API details.

## Usage

`npm install petiole-immutable --save`

```javascript
import petiole from 'petiole';
import immutable from 'petiole-immutable';

const { declareLeaf, createStore } = petiole(immutable);

const items = declareLeaf({
  initialState: {
    list: [0, 1, 2],
  },
  actions: {
    add: item,
  },
  reducer: {
    add: (state, { item }) => state.list.push(item),
  },
});

const store = createStore({ items });
const state = store.getState();

// Notice: only the leaf is a Collection - not the root node
const itemList = state.items.get('list');
```