import { isOwn } from "../../shared";

const map = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
};
export const publicInstanceHandlers = {
  get({ _: instance }, key) {
    // setup
    const { setupState, props } = instance;
    if (isOwn(key, setupState)) {
      return setupState[key];
    } else if (isOwn(key, props)) {
      return props[key];
    }

    // type
    // if (key == "$el") {
    //   return instance.vnode.el;
    // }
    const getter = map[key];
    if (getter) return getter(instance);
  },
  set(target, key, val) {
    return true;
  },
};
