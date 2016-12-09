# Petiole change log

## 0.3.1 (2016-12-09)

* Official React bindings plugin: react-petiole

## 0.3.0 (2016-10-31)

* Auto-immutability removed from the core and moved to two new plugins:
  * petiole-immutable for Immutable.js support
  * petiole-seamless-immutable for seamless-immutable support
* Action creator constructor API changed

## 0.2.4 (2016-10-31)

* New function: combineLeaflets(*...leaflets*)
* createStore() accepts also tree structure as an argument
* declareLeaf() accepts multiple leaflets as arguments and combines them automatically

## 0.2.3 (2016-10-25)

* New plugin: petiole-devtools-extension

## 0.2.2 (2016-10-24)

* Support for Redux enhancers
* New functions added:
  * petiole.middleware(*reduxMiddleware*)
  * petiole.enhancer(*reduxEnhancer*)
  * petiole.actionCreatorBuilder(*petioleActionCreatorBuilder*)

## 0.2.1 (2016-10-24)

* Support for older versions of Node (code transpiled to ES5)

## 0.2.0 (2016-10-24)

* Function names changed:
  * createLeaf() -> declareLeaf()
  * combineTree() -> createTree()
* New function added:
  * createOrphanLeaf(*leaf, namespace*)

## 0.1.0 (2016-10-22)

* Initial release