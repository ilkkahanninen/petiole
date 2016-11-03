
const updatesObject = (oldObj, mergeObj) => {
  if (oldObj == null) {
    return true;
  }
  const props = Object.keys(mergeObj);
  for (let i in props) {
    const prop = props[i];
    if (oldObj[prop] !== mergeObj[prop]) {
      return true;
    }
  }
  return false;
};

module.exports = updatesObject;
