# Petiole

Easy and predictable state container for JavaScript apps.

**Warning:** This library is still in experimental proof-of-concept phase.

## Goals & features

* Easy and quick to use.
  * Shortcuts for simple action creators.
  * Automatic action types.
* Built on [Redux](http://redux.js.org/): most of its tooling & plugins are available.
* Automatic immutability via plugins.
* Easy unit testing.
* Easily refactorable state:
  * Action type constants are resolved automatically.
  * Leafs of the state/reducer/selector tree are autonomous.
* Automatically memoized selectors.
* Extendable with plugins.

## Installing

```
npm install petiole --save
```

## Tutorial

This tutorial assumes you are familiar with Redux.

First you need to create instance of Petiole by calling the function imported from the library. You can pass Petiole plugins and Redux middleware here as arguments.

Petiole() returns following functions:
* declareLeaf(*leafDeclaration: LeafDeclaration*): *PartialLeaf*
* createTree(*treeStructure: TreeStructure*): *Tree*
* createOrphanLeaf(*partialLeaf: PartialLeaf, namespace: string*): *Leaf*
* createStore(*tree: Tree|TreeStructure*): *Store*
* combineLeaflets(*...leafDeclarations: LeafDeclaration*): *LeafDeclaration*

```javascript
// petiole.js

import petiole from 'petiole';
import thunk from 'petiole-thunk'; // Plugin for thunk action creators
import immutable from 'petiole-seamless-immutable'; // Automatic immutable objects

// Instantiate Petiole with thunk and immutable plugins:
const instance = petiole(
  thunk,
  immutable
);

// ES6 way to export the API:
export const {
  declareLeaf,
  createTree,
  createStore,
  createOrphanLeaf,
  combineLeaflets,
} = instance;

// CommonJS way:
module.exports = instance;
```

Petiole embraces the idea of Redux reducer bundles, better known as [ducks](https://github.com/erikras/ducks-modular-redux), but takes them further with uniform construction function and throws support for selectors in. In Petiole these bundles are called **leaves** -- they are the leaf nodes (end-nodes) in our state tree.

Let's create the Hello World of action creator-reducers-bundles: the counter. declareLeaf() returns a partially constructed leaf and it needs to be attached to a tree before you can really use it.

```javascript
import { declareLeaf, createTree } from './petiole';

const counter = declareLeaf({
  initialState: {
    value: 0,
  },
  actions: {
    increase: true, // Action creator shortcut
  },
  reducer: {
    increase() {
      // Notice: We loaded seamless-immutable plugin in previous step which makes
      // the state a seamless-immutable object and we can use its helper functions.
      return state => state.set('value', state.value + 1);
    },
  },
});

const tree = createTree({ counter });
```

Now we have functional action creators and a reducer function.

initalState declares the initial state of the object.

actions contains action creators. Here we used a shortcut `true` which defines the simplest possible action creator `function () { return { type: 'actionType' }; }` where *actionType* is the name of the creator, in our case *increase*. These constructors do the same thing:

```javascript
{
  increase: true,
  increase: { type: 'increase' },
  increase: () => ({ type: 'increase' }),
}
```

You can now access the action creator by calling `counter.actions.increase()` which returns the action. Some magic happens here: the returned action is `{ type: 'counter/increase' }`. Petiole automatically resolves action type names for following benefits:

* Shorter and nicer type names because name collisions are impossible.
* You can immediately see in which part of the tree the leaf is which created the action.
* If you refactor the shape of tree action types are updated without extra effort.

You get the resolved action types from actionTypes object, e.g. `counter.actionTypes.increase`.

**Notice:** createTree() takes the ownership of the leaf and you can attach a leaf only once. If you want to reuse a leaf you have to reuse the declaration object, not the partially instantiated leaf.

Ok. We have our action creators but how do access the state and dispatch the actions? Same way as with Redux. First we need to create our store. Use Petiole's own `createStore`:

```
import { createStore } from './petiole';
const store = createStore(tree);
```

You can also omit calling *createTree* and pass the tree structure straigh to *createStore*.

Now we have everything together. The store object is actually a Redux store you are hopefully familiar already:

```javascript
store.getState(); // => { counter: { value: 0 } }
store.dispatch(counter.actions.increase());
store.getState(); // => { counter: { value: 1 } }
```

## More examples

TODO: Selectors, all action creator shortcuts

```javascript
// store.js
import { createTree, createStore } from './petiole';
import users from './users';

const tree = createTree({
    users,
});

export default const store = createStore(tree);
```

Use them together:

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

Example of communication between leaves:

```javascript
// Listening to action types of another leaf

const leafA = declareLeaf({
    actions: {
        trigger: true,
    },
});

const leafB = declareLeaf({
    initialState: {
        value: false,
    },
    reducer: {
        // This name will be replaced so it can be anything as long it contains /.
        // It is a recommended convention to use format leafName/actionType.
        // Notice: value is a tuple of two functions: the first one resolves the
        // action type name and the second one is the reducer function.
        'leafA/trigger': [
            // Function which resolves the action type name
            () => leafA.actionTypes.trigger,
            // The actual method
            state => state.set('value', true),
        ],
    },
});

const tree = createTree({
    a: leafA,
    b: leafB,
});

const store = createStore(tree);

store.dispatch(leafA.actions.trigger());
store.getState(); // => { a: {}, b: { value: true } }
```

Combine leaf from leaflets:

``` javascript
const fetchableListLeaflet = {
  initialState: {
    list: [],
    isFetching: false,
    fetchError: null,
  },
  actions: {
    receive: 'list',
    fetchError: 'error',
  },
  reducer: {
    fetch: state => state.set('isFetching', true),
    receive: (state, { list }) => state.merge({ isFetching: false, list, error: null }),
    fetchError: (state, { error }) => state.merge({ isFetching: false, error })
  },
};

const usersLeafDecl = combineLeaflets(
  fetchableListLeaflet,
  {
    actions: {
      fetch: dispatch => ClientAPI.getUsers().then(this.receive).catch(this.fetchError)
    }
  }
);

const users = declareLeaf(usersLeafDecl);
```

