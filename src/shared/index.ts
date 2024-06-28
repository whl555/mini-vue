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

/**
 * @private
 * 首字母大写
 */
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * @private
 * 添加 on 前缀，并且首字母大写
 */
export const toHandlerKey = (str: string) =>
  str ? `on${capitalize(str)}` : ``;

const camelizeRE = /-(\w)/g;
/**
 * @private
 * 把烤肉串命名方式转换成驼峰命名方式
 */
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
};

export const isFunction = (val) => {
  return val != null && typeof val == "function";
};

export const EMPTY_OBJ = {};
