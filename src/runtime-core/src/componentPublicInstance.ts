const map = {
  $el: (i) => i.vnode.el,
};
export const publicInstanceHandlers = {
  get({ _: instance }, key) {
    console.log("@", instance);

    // setup
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
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
