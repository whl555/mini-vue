import { createVNode } from "../vnode";

export function renderSlots(slots, name) {
  const slot = slots[name];
  if (!slot) {
    console.warn("该名字的slot不存在");
    return;
  }
  return createVNode("div", {}, slot);
}
