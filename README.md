# Petiole

Easy and predictable state container for JavaScript apps.

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

## Read more

* [Core documentation](https://github.com/ilkkahanninen/petiole/blob/master/packages/petiole/README.md)

## Plugins

### Asynchronicity
* [petiole-thunk](https://github.com/ilkkahanninen/petiole/blob/master/packages/petiole-thunk/README.md)

### Immutability
* [petiole-seamless-immutable](https://github.com/ilkkahanninen/petiole/blob/master/packages/petiole-seamless-immutable/README.md)
* [petiole-immutable](https://github.com/ilkkahanninen/petiole/blob/master/packages/petiole-immutable/README.md)

### Development tools
* [petiole-devtools-extension](https://github.com/ilkkahanninen/petiole/blob/master/packages/petiole-devtools-extension/README.md)