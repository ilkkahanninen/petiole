const ACTION_CREATOR_BUILDER = 'actionCreatorBuilder';
const REDUX_MIDDLEWARE = 'reduxMiddleware';
const REDUX_ENHANCER = 'reduxEnhancer';

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

module.exports = {
  actionCreatorBuilder,
  middleware,
  enhancer,
  ACTION_CREATOR_BUILDER,
  REDUX_MIDDLEWARE,
  REDUX_ENHANCER,
};
