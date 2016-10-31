function definePrivateProperty(obj, prop, value = true) {
  Object.defineProperty(
    obj,
    prop,
    {
      value,
      enurable: false,
      writable: false,
    }
  );
  return obj;
}

module.exports = definePrivateProperty;
