import App from './App';
import { connect } from 'react-petiole';
import items from '../../store/items';

export default connect({
  state: {
    items,
    itemCount: items.selectors.itemCount,
  },
  actions: {
    ...items.actions,
  },
})(App);
