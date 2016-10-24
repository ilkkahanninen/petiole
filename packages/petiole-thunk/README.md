# petiole-thunk

Thunk plugin for Petiole.

## Example of leaf using thunk

```javascript
// users.js
import { declareLeaf } from './petiole';

export default const users = declareLeaf({
    initialState: {
        names: [],
        isLoading: false,
        error: false,
    },
    actions: {
        // My thunk:
        fetch: () => dispatch => {
            dispatch(); // dispatches { type: 'users/fetch' }
            ClientAPI.fetchUsers()
                .then(this.receive)
                .catch(this.fetchError);
        },
        receive: 'names', // shortcut for (names) => ({ type: 'users/names', names })
        fetchError: true, // shortcut for () => ({ type: 'users/fetchError' })
    },
    selectors: {
        userCount: state => state.names.length,
    },
    reducer: {
        fetch: state => state.set('isLoading', true),
        receive: (state, { names }) => state.merge({ names, isLoading: false }),
        fetchError: state => state.set('error', true),
    },
})
```
