# Petiole

Easy and predictable state container for JavaScript apps.
This library experimental proof-of-concept and it is still in very early status.

## Goals & features

* Easy and quick to use.
  * Shortcuts for simple action creators.
  * Automatic action types.
* Built on [Redux](http://redux.js.org/): most of its tooling & plugins are available.
* Automatic immutability (via [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)).
* Easy unit testing.
* Easily refactorable state:
  * Action type constants are resolved automatically.
  * Leafs of the state/reducer/selector tree are autonomous.
* Automatically memoized selectors.

## Example

```javascript
// users.js
import { createLeaf } from 'petiole';

export default const users = createLeaf({
    initialState: {
        names: [],
        isLoading: false,
        error: false,
    },
    actions: {
        fetch: () => dispatch => {
            dispatch(); // dispatches { type: 'users/fetch' }
            ClientAPI.fetchUsers()
                .then(names => dispatch(this.receive(names))
                .catch(() => dispatch(this.fetchError()));
        },
        receive: 'names', // shortcut for (names) => ({ type: 'users/names', names })
        fetchError: true, // shortcut for () => ({ type: 'users/fetchError' })
    },
    selectors: {
        userCount: state => state.names.length,
    },
    reducer: {
        fetch: state => state.set('isLoading', true),
        receive: (state, { names }) => state.merge({ names, isLoading: false }),
        fetchError: state => state.set('error', true),
    },
})
```

```javascript
// store.js
import { combineTree, createStore } from 'petiole';
import users from './users';

const tree = combineTree({
    users,
});

export default const store = createStore(tree);
```

```javascript
// Usage
import store from './store';
import users from './users';

// Dispatching an action
store.dispatch(users.actions.fetch());

// Selecting users leaf state
users.select(store.getState()); // => { names: ['John'], isLoading: false, etc... }

// Using selectors
users.selectors.userCount(store.getState()); // => 1

// Getting action type constants
users.actionTypes; // => { fetch: 'users/fetch', receive: 'users/receive', etc... }
```

```
// Listening to action types of another leaf

const leafA = createLeaf({
    actions: {
        trigger: true,
    },
});

const leafB = createLeaf({
    initialState: {
        value: false,
    },
    reducer: {
        // This name will be replaced so it can be anything as long it contains /.
        // It is a recommended convention to use format leafName/actionType.
        // Notice: value is a tuple [function, function]
        'leafA/trigger': [
            // Function which resolves the action type name
            () => leafA.actionTypes.trigger,
            // The actual method
            state => state.set('value', true),
        ],
    },
});

const tree = combineTree({
    a: leafA,
    b: leafB,
});

const store = createStore(tree);

store.dispatch(leafA.actions.trigger());
store.getState(); // => { a: {}, b: { value: true } }
```