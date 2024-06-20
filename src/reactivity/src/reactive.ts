import { track, trigger } from "./effect";

export default function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      const res = Reflect.get(target, key);

      // TODO 收集依赖
      track(target, key);
      return res;
    },

    set(target, key, value) {
      const res = Reflect.set(target, key, value);

      // TODO 触发依赖
      trigger(target, key);
      return res;
    },
  });
}
