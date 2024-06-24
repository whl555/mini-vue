export const extend = Object.assign;

export const isObject = (val) => {
  return val != null && typeof val == "object";
};

export const isSame = (val, newVal) => {
  return Object.is(val, newVal);
};

// val中是否有key
export const isOwn = (key, obj) =>
  Object.prototype.hasOwnProperty.call(obj, key);
