import { isObject } from "../../shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./handlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

export function reactive(target) {
  return createReactiveObject(target, mutableHandlers);
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandlers);
}
export function shallowReadonly(target) {
  return createReactiveObject(target, shallowReadonlyHandlers);
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isReactive(value) {
  // 如果 value 是 proxy 的话
  // 会触发 get 操作，而在 createGetter 里面会判断
  // 如果 value 是普通对象的话
  // 那么会返回 undefined ，那么就需要转换成布尔值
  return !!value[ReactiveFlags.IS_REACTIVE];
}

function createReactiveObject(target, handler) {
  if (!isObject(target)) {
    console.warn("非对象类型不能构成响应式对象");
    return target;
  }

  return new Proxy(target, handler);
}
