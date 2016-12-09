const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const mapValues = require('lodash.mapvalues');

function mapStateToProps(selectors = {}) {
  return (state, props) => mapValues(selectors, selector => {
    if (typeof selector === 'object' && typeof selector.select === 'function') {
      return selector.select(state, props);
    }
    if (typeof selector === 'function') {
      return selector(state, props);
    }
    return selector;
  });
}

function mapDispatchToProps(actions = {}, actionsWithProps = () => ({})) {
  return (dispatch, props) => bindActionCreators(
    Object.assign(
      {},
      actions,
      actionsWithProps(props)
    ),
    dispatch
  );
}

function connectPetiole(options = {}) {
  return connect(
    mapStateToProps(options.state, options.mapStateToProps),
    mapDispatchToProps(options.actions, options.actionsWithProps)
  );
}

module.exports = connectPetiole;
