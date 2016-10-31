const ACTION_CREATOR_BUILDER = 'actionCreatorBuilder';
const REDUX_MIDDLEWARE = 'reduxMiddleware';
const REDUX_ENHANCER = 'reduxEnhancer';
const IMMUTABLE = 'immutable';

function actionCreatorBuilder(builder) {
  return {
    [ACTION_CREATOR_BUILDER]: builder,
  };
}

function middleware(middleware) {
  return {
    [REDUX_MIDDLEWARE]: middleware,
  };
}

function enhancer(enhancer) {
  return {
    [REDUX_ENHANCER]: enhancer,
  };
}

function immutable(constructor, immutableTest) {
  const plugin = {
    [IMMUTABLE]: constructor,
  };
  if (immutableTest) {
    plugin[IMMUTABLE].isImmutable = immutableTest;
  }
  return plugin;
}

module.exports = {
  actionCreatorBuilder,
  middleware,
  enhancer,
  immutable,
  ACTION_CREATOR_BUILDER,
  REDUX_MIDDLEWARE,
  REDUX_ENHANCER,
  IMMUTABLE,
};
