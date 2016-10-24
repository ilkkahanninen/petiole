import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
  }

  addItem() {
    const { newItem } = this.refs;
    this.props.addItem(newItem.value);
    newItem.value = '';
  }

  render() {
    const { items, removeItem } = this.props;
    return (
      <div className="App">
        <div className="App-header">
          <h2>{items.name}</h2>
        </div>
        <ul>
          {items.list.map((item, index) => (
            <li
              key={index}
              onClick={() => removeItem(index)}
            >
              {item}
            </li>
          ))}
        </ul>
        <input ref="newItem" />
        <button onClick={this.addItem}>Add</button>
      </div>
    );
  }
}

export default App;
