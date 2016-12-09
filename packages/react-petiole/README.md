# react-petiole

React binding for Petiole.

## Installation

`npm install react-petiole --save`

## Usage

react-petiole exports react-redux Provider and it is used exactly the same way:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-petiole';
import store from './store';
import App from './components/App';

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root')
);
```

This library exports also connect function but it works a little different way.
Instead of mapping functions (mapStateToProps and mapDispatchToProps) it takes an object which may contain one or more of following properties:

**selectors:** An object containing selectors. Selector gets a piece from the application state. The returned piece is passed as a property to the component.

If selector is a function it is called with arguments *state* and *props*. If selector is an object containing a function in property *select* it is used the same way. In other cases the selector itself is returned.

**actions:** TODO

**actionsWithProps:** TODO

```javascript
import users from './leaves/users';
import notifications from './leaves/notifications';

connect({
  selectors: {
    // Select everything belonging to users leaf and put it to property 'users'
    users,
    // Use notifications leaf's count() selector to get number of notifications
    notificationCount: notifications.selectors.count,
    // Pass component properties to the selector
    currentUser: (state, props) => users.selectors.userById(props.params.id),
  },
  actions: {
    // Map all actions from users leaf
    ...users.actions,
    // Pick one action from notifications leaf
    dismissNotification: notifications.actions.dismiss,
  },
  actionsWithProps: props => ({
    // Include component property to action call
    updateCurrentUser: (data) => users.actions.update(props.params.id, data),
  }),
})
```
