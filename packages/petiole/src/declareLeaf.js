const Immutable = require('seamless-immutable');
const mapKeys = require('lodash.mapkeys');
const mapValues = require('lodash.mapvalues');
const zipObject = require('lodash.zipobject');
const get = require('lodash.get');
const memoize = require('./memoize');
const builtInActionCreatorBuilders = require('./actionCreatorBuilders');
const { ACTION_CREATOR_BUILDER } = require('./pluginWrappers');
const definePrivateProperty = require('./definePrivateProperty');
const combineLeaflets = require('./combineLeaflets');

const createContext = memoize((actions, dispatch) => (
  mapValues(actions, action => (...args) => dispatch(action(...args)))
));

function createDeclareLeaf(plugins = []) {

  const actionCreatorBuilders = builtInActionCreatorBuilders.concat(
    plugins
      .map(plugin => plugin[ACTION_CREATOR_BUILDER])
      .filter(fn => typeof fn === 'function')
  );

  return function declareLeaf(...leaflets) {
    const {
      initialState,
      actions,
      selectors,
      reducer,
      actionTypes,
    } = combineLeaflets(...leaflets);

    let namespace, namespaceArray, reducerFuncs;

    const leaf = {};
    definePrivateProperty(leaf, '__isLeaf');
    definePrivateProperty(leaf, '__leafWillMountTo', function leafWillMountTo(position) {
      namespace = position;
      namespaceArray = position.split('/');

      // Prefix action types with leaf namespace
      const typeNames = Object.keys(actions)
        .concat(Object.keys(reducer))
        .concat(actionTypes)
        .filter(name => name.indexOf('/') < 0);

      leaf.actionTypes = zipObject(
        typeNames,
        typeNames.map(getActionType)
      );

      delete this.__leafWillMountTo;
    });
    definePrivateProperty(leaf, '__leafDidMount', function leafDidMount() {
      // Map prefixed action type names to reducer functions
      reducerFuncs = mapValues(
        mapKeys(reducer, (func, name) => (
          Array.isArray(func)
            ? func[0].call()
          : getActionType(name)
        )),
        (func) => (Array.isArray(func) ? func[1] : func)
      );
      delete this.__leafDidMount;
    });

    // Resolve action type for given name
    const getActionType = name => (
      name.indexOf('/') < 0
        ? `${namespace}/${name}`
        : name
    );

    // Create main reducer function
    leaf.reducer = (state = Immutable(initialState), action) => {
      const { type } = action;
      if (reducerFuncs[type]) {
        return reducerFuncs[type].call(null, state, action);
      }
      return state;
    };

    // Create action creators
    leaf.actions = {};
    Object.assign(leaf.actions, mapValues(
      actions,
      (creatorValue, creatorName) => {
        for (let i = 0; i < actionCreatorBuilders.length; i++) {
          const creator = actionCreatorBuilders[i](
            creatorValue,
            creatorName,
            getActionType,
            dispatch => createContext(leaf.actions, dispatch)
          );
          if (creator) {
            return creator;
          }
        }
        return creatorValue;
      }
    ));

    // Map selectors
    leaf.selectors = mapValues(
      selectors,
      selector => memoize(
        (state, ...rest) => selector(
          get(state, namespaceArray),
          ...rest
        )
      )
    );

    // Utility to get state branch associated to this leaf
    leaf.select = state => get(state, namespaceArray);

    return leaf;
  };
}

module.exports = createDeclareLeaf;
