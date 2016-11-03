# petiole-reducers

Utility library for writing cleaner Petiole reducers.

## Installation

`npm install petiole-reducers --save`

## Usage

### pluck

Returns the value from the action with the supplied property name.

`(propName) => (action, state) => any`

```javascript
{
  initialState: {
    name: null,
  },
  actions: {
    setName: 'newName',
  },
  reducers: {
    setName: merge({
      name: pluck('newName),
    })
  },
}
```

### merge

`(objectToMerge) => (action, state) => object`

### replace

`(object) => (action, state) => object`

### push

`(item) => (action, state) => array`

### remove

`(predicate) => (action, state) => array`

### add

`(number) => (action, state) => number`

### subtract

`(number) => (action, state) => number`
