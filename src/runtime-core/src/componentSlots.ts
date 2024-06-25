import { ShapeFlags } from "../../shared/shapeFlags";

export function initSlots(instance, children) {
  const { shapeFlag } = instance.vnode;
  if (shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    updateSlots(instance, children);
  }
}

function updateSlots(instance, children) {
  const slots = {};
  for (const key in children) {
    const slot = children[key];
    slots[key] = (props) => toArraySlots(slot(props));
  }
  instance.slots = slots;
}

function toArraySlots(slot) {
  return Array.isArray(slot) ? slot : [slot];
}
