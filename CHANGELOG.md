# Petiole change log

## 0.2.2 (2016-10-xx)

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