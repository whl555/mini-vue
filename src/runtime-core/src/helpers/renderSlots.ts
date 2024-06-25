import { isFunction } from "../../../shared";
import { Fragment, createVNode } from "../vnode";

export function renderSlots(slots, name, props?) {
  const slot = slots[name];
  if (!slot) {
    console.warn("该名字的slot不存在");
    return;
  }
  if (!isFunction(slot)) {
    console.warn("该名字的slot不是函数形式");
    return;
  }
  return createVNode(Fragment, {}, slot(props));
}
