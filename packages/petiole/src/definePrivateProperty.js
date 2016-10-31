function definePrivateProperty(obj, prop, value = true) {
  Object.defineProperty(
    obj,
    prop,
    {
      value,
      enurable: false,
      writable: false,
      configurable: true,
    }
  );
  return obj;
}

module.exports = definePrivateProperty;
