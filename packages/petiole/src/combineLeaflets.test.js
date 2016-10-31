const test = require('tape');
const combineLeaflets = require('./combineLeaflets');

test('combineLeaflets() combines', function(t) {
  const leaf = combineLeaflets(
    {
      initialState: {
        fooValue: 0,
      },
      actions: {
        foo: true,
      },
      selectors: {
        getFoo: state => state.foo,
      },
      reducer: {
        foo: state => state.set('fooValue', state.fooValue + 1),
      },
      actionTypes: [
        'foo123',
      ],
    },
    {
      initialState: {
        barValue: 1000,
      },
      actions: {
        bar: true,
      },
      selectors: {
        getBar: state => state.bar,
      },
      reducer: {
        bar: state => state.set('barValue', state.barValue - 1),
      },
      actionTypes: [
        'bar123',
      ],
    }
  );
  t.equal(leaf.initialState.fooValue, 0);
  t.equal(leaf.initialState.barValue, 1000);
  t.equal(leaf.actions.foo, true);
  t.equal(leaf.actions.bar, true);
  t.equal(typeof leaf.selectors.getFoo, 'function');
  t.equal(typeof leaf.selectors.getBar, 'function');
  t.equal(leaf.actionTypes.length, 2);
  t.end();
});

test('combineLeaflets() throws on duplicate initial state properties', function(t) {
  t.throws(() => {
    combineLeaflets(
      { initialState: { foo: true } },
      { initialState: { foo: true } }
    );
  });
  t.end();
});

test('combineLeaflets() throws on duplicate actions', function(t) {
  t.throws(() => {
    combineLeaflets(
      { actions: { foo: true } },
      { actions: { foo: true } }
    );
  });
  t.end();
});

test('combineLeaflets() throws on duplicate reducers', function(t) {
  t.throws(() => {
    combineLeaflets(
      { reducer: { foo: true } },
      { reducer: { foo: true } }
    );
  });
  t.end();
});

test('combineLeaflets() throws on duplicate selectors', function(t) {
  t.throws(() => {
    combineLeaflets(
      { selectors: { foo: () => null } },
      { selectors: { foo: () => null } }
    );
  });
  t.end();
});

test('combineLeaflets() throws on duplicate action types', function(t) {
  t.throws(() => {
    combineLeaflets(
      { actionTypes: ['foo'] },
      { actionTypes: ['foo'] }
    );
  });
  t.end();
});
