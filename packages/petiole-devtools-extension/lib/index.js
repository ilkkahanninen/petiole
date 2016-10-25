'use strict';

var plugin = {};

if (typeof window === 'object') {
  if (!window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    console.log('Tip: Install Redux DevTools browser extension for better development experience from http://zalmoxisus.github.io/redux-devtools-extension/');
  } else {
    plugin = {
      reduxEnhancer: window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    };
  }
}

module.exports = plugin;
