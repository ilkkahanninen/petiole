const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const mapValues = require('lodash.mapvalues');

function mapStateToProps(selectors) {
  return state => mapValues(selectors, selector => {
    if (typeof selector === 'object' && typeof selector.select === 'function') {
      return selector.select(state);
    }
    if (typeof selector === 'function') {
      return selector(state);
    }
    return selector;
  });
}

function mapDispatchToProps(actions) {
  return actions
    ? dispatch => bindActionCreators(actions, dispatch)
    : null;
}

function connectPetiole(options = {}) {
  return connect(
    mapStateToProps(options.state),
    mapDispatchToProps(options.actions)
  );
}

module.exports = connectPetiole;
