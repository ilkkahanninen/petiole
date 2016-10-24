import App from './App';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import items from '../../store/items';

export default connect(
  state => ({
    items: items.select(state),
    itemCount: items.selectors.itemCount(state),
  }),
  dispatch => bindActionCreators(
    items.actions,
    dispatch
  )
)(App);
