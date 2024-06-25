export function initSlots(instance, children) {
  const slots = {};
  for (const key in children) {
    const slot = children[key];
    slots[key] = toArraySlots(slot);
  }
  instance.slots = slots;
}

function toArraySlots(slot) {
  return Array.isArray(slot) ? slot : [slot];
}
