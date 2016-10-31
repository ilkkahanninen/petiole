# petiole-seamless-immutable

Wraps state in Petiole store automatically to immutable data structures which are
backwards-compatible with normal JS Arrays and Objects.

See [rtfeldman/seamless-immutable](https://github.com/rtfeldman/seamless-immutable) for API details.

## Usage

`npm install petiole-seamless-immutable --save`

```javascript
import petiole from 'petiole';
import immutable from 'petiole-seamless-immutable';

const { declareLeaf, createStore } = petiole(immutable);

const numbers = declareLeaf({
  initialState: {
    list: [0, 1, 2],
  },
});
const store = createStore({ numbers });
const state = store.getState();

state.numbers.list.push(3); // throws ImmutableError
```