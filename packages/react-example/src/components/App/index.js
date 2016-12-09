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
  actionsWithProps: props => ({
    test: (msg) => {
      console.log('Hello', msg, 'with', props);
      return { type: '##TEST' };
    },
  })
})(App);
