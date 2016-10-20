
module.exports = function memoize(fn) {
  let cache, cacheArgs;
  return (...args) => {
    let invalidated = false;
    if (cache && cacheArgs.length === args.length) {
      for (let i = 0, j = args.length; i < j; i++) {
        if (args[i] !== cacheArgs[i]) {
          invalidated = true;
          break;
        }
      }
    } else {
      invalidated = true;
    }
    if (invalidated) {
      cache = fn(...args);
      cacheArgs = args;
    }
    return cache;
  };
};
